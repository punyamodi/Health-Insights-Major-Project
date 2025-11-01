import React, { useState, useCallback } from 'react';
import ReportInput from './components/ReportInput';
import AgentCard from './components/AgentCard';
import FinalReportComponent from './components/FinalReport';
import { SPECIALIST_AGENTS } from './constants';
import { SpecialistReport, FinalReport, MedicalSpecialty, PatientHistory, SpecialistAnalysis } from './types';
import { analyzeWithSpecialistAgent, generateFinalDiagnosis } from './services/geminiService';
import { LogoIcon } from './components/icons';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const initialPatientHistory: PatientHistory = {
  pastDiagnoses: '',
  chronicConditions: '',
  allergies: '',
  currentMedications: '',
  familyHistory: '',
  lifestyleFactors: '',
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'main'>('landing');
  
  const [reportText, setReportText] = useState<string>('');
  const [patientHistory, setPatientHistory] = useState<PatientHistory>(initialPatientHistory);
  const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);

  const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const initialSpecialistReports = SPECIALIST_AGENTS.reduce((acc, agent) => {
    acc[agent.name] = { specialty: agent.name, analysis: null, status: 'pending' };
    return acc;
  }, {} as Record<MedicalSpecialty, SpecialistReport>);

  const [specialistReports, setSpecialistReports] = useState<Record<MedicalSpecialty, SpecialistReport>>(initialSpecialistReports);
  const [finalReport, setFinalReport] = useState<FinalReport>({ summary: '', status: 'pending' });

  const resetState = () => {
    setReportText('');
    setPatientHistory(initialPatientHistory);
    setImage(null);
    setAnalysisStarted(false);
    setIsLoading(false);
    setSpecialistReports(initialSpecialistReports);
    setFinalReport({ summary: '', status: 'pending' });
    setView('main'); // Go to input screen, not landing
  };

  const handleReportSubmit = useCallback(async (text: string, history: PatientHistory, img: { base64: string; mimeType: string } | null) => {
    setReportText(text);
    setPatientHistory(history);
    setImage(img);
    setAnalysisStarted(true);
    setIsLoading(true);

    const analysisPromises = SPECIALIST_AGENTS.map(agent => {
      setSpecialistReports(prev => ({
        ...prev,
        [agent.name]: { ...prev[agent.name], status: 'loading' }
      }));
      return analyzeWithSpecialistAgent(agent.name, text, history, img)
        .then(analysis => ({ specialty: agent.name, analysis, error: typeof analysis === 'string' }))
        .catch(error => ({ specialty: agent.name, analysis: `Error: ${error.message}`, error: true }));
    });

    const specialistResults: Record<string, SpecialistAnalysis> = {};

    for (const promise of analysisPromises) {
      const result = await promise;
      const status = result.error ? 'error' : 'complete';
      setSpecialistReports(prev => ({
        ...prev,
        [result.specialty]: { specialty: result.specialty, analysis: result.analysis, status: status }
      }));
      if(!result.error && typeof result.analysis === 'object'){
        specialistResults[result.specialty] = result.analysis;
      }
    }

    setFinalReport({ summary: '', status: 'loading' });
    try {
      const finalDiagnosis = await generateFinalDiagnosis(specialistResults, text, history);
      setFinalReport({ summary: finalDiagnosis, status: 'complete' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setFinalReport({ summary: `Failed to generate final report: ${errorMessage}`, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportPDF = async () => {
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;

    const reportElement = document.getElementById('printable-report');
    if (!reportElement) return;

    setIsExporting(true);
    
    try {
        const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasWidth / canvasHeight;
        const widthInPdf = pdfWidth;
        const heightInPdf = widthInPdf / ratio;

        let position = 0;
        let heightLeft = heightInPdf;

        pdf.addImage(imgData, 'PNG', 0, position, widthInPdf, heightInPdf);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, widthInPdf, heightInPdf);
            heightLeft -= pdfHeight;
        }

        pdf.save('Medical_Analysis_Report.pdf');

    } catch (error) {
        console.error("Error exporting to PDF:", error);
    } finally {
        setIsExporting(false);
    }
  };

  const hasHistory = Object.values(patientHistory).some(field => String(field).trim() !== '');

  const renderPrintableAnalysis = (analysis: SpecialistAnalysis | string | null) => {
    if (typeof analysis === 'string') {
        return <p>{analysis}</p>;
    }
    if (analysis && typeof analysis === 'object') {
        return (
            <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                <h4 style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>Key Findings</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {analysis.keyFindings?.map((item, index) => <li key={`pkf-${index}`}>{item}</li>)}
                </ul>
                <h4 style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>Potential Conditions</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {analysis.potentialConditions?.map((item, index) => <li key={`ppc-${index}`}>{item}</li>)}
                </ul>
                <h4 style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>Recommendations</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {analysis.recommendations?.map((item, index) => <li key={`pr-${index}`}>{item}</li>)}
                </ul>
            </div>
        );
    }
    return <p>No analysis available.</p>;
  };

  const Header = () => (
    <header className="bg-white/80 backdrop-blur-lg fixed w-full top-0 z-40 border-b border-[var(--c-border)] shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('landing')}>
                <LogoIcon className="w-8 h-8 text-[var(--c-primary)]" />
                <span className="font-semibold text-lg text-[var(--c-text-primary)]">AI Medical Diagnosis</span>
            </div>
            {view === 'main' && (
                 <div className="flex items-center space-x-2">
                    {finalReport.status === 'complete' && (
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-3 py-1.5 text-sm font-medium bg-[var(--c-secondary)] text-white rounded-md hover:bg-opacity-90 transition disabled:bg-opacity-60 disabled:cursor-not-allowed flex items-center"
                    >
                        {isExporting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Exporting...
                        </>
                        ) : 'Export PDF'}
                    </button>
                    )}
                    <button
                        onClick={resetState}
                        className="px-3 py-1.5 text-sm font-medium bg-[var(--c-border)] text-[var(--c-text-primary)] rounded-md hover:bg-opacity-80 transition"
                        >
                        New Report
                    </button>
                </div>
            )}
        </div>
    </header>
  );

  const Footer = () => (
     <footer className="w-full text-center mt-auto py-8 text-sm text-[var(--c-text-secondary)]">
        <p>Disclaimer: This is an AI-powered demonstration and not a substitute for professional medical advice.</p>
      </footer>
  );

  const LandingPage = ({ onStart }: { onStart: () => void }) => (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center pt-16 p-4 text-center">
            <LogoIcon className="w-20 h-20 text-[var(--c-primary)] mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--c-text-primary)]">
                AI-Powered Medical Diagnosis
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-[var(--c-text-secondary)]">
                Leverage a multi-agent AI system to analyze medical reports, providing comprehensive assessments from various medical specialties for a holistic diagnostic view.
            </p>
            <div className="mt-10">
                <button
                    onClick={onStart}
                    className="px-8 py-4 bg-[var(--c-primary)] text-white rounded-lg shadow-lg text-lg font-semibold hover:bg-[var(--c-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--c-primary)] transition-colors duration-150"
                >
                    Start New Analysis
                </button>
            </div>
            <div className="mt-20 max-w-5xl w-full">
                <h2 className="text-3xl font-bold text-[var(--c-text-primary)] mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-border)] shadow-md transition hover:shadow-xl hover:-translate-y-1">
                        <div className="font-bold text-[var(--c-primary)] mb-2">Step 1</div>
                        <h3 className="font-semibold text-xl text-[var(--c-text-primary)] mb-2">Provide Data</h3>
                        <p className="text-sm text-[var(--c-text-secondary)]">Upload, paste, or type a medical report. You can also include patient history and medical images.</p>
                    </div>
                    <div className="p-8 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-border)] shadow-md transition hover:shadow-xl hover:-translate-y-1">
                        <div className="font-bold text-[var(--c-primary)] mb-2">Step 2</div>
                        <h3 className="font-semibold text-xl text-[var(--c-text-primary)] mb-2">AI Analysis</h3>
                        <p className="text-sm text-[var(--c-text-secondary)]">Our team of specialized AI agents analyzes the data from their unique medical perspectives.</p>
                    </div>
                    <div className="p-8 bg-[var(--c-surface)] rounded-2xl border border-[var(--c-border)] shadow-md transition hover:shadow-xl hover:-translate-y-1">
                        <div className="font-bold text-[var(--c-primary)] mb-2">Step 3</div>
                        <h3 className="font-semibold text-xl text-[var(--c-text-primary)] mb-2">Get Report</h3>
                        <p className="text-sm text-[var(--c-text-secondary)]">Receive an integrated final diagnosis and a breakdown of each specialist's findings.</p>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('main')} />;
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg)] text-[var(--c-text-primary)] font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-24 flex-grow">
        {!analysisStarted ? (
            <>
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--c-text-primary)] sm:text-5xl">
                    New Patient Analysis
                    </h1>
                    <p className="mt-4 text-lg text-[var(--c-text-secondary)]">
                    Provide patient data below to begin the multi-agent diagnostic process.
                    </p>
                </div>
                <ReportInput onSubmit={handleReportSubmit} isLoading={isLoading} />
            </>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-[var(--c-border)] p-6">
                <h2 className="text-xl font-semibold mb-4 text-[var(--c-text-primary)]">Patient Summary</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium text-sm uppercase tracking-wide text-[var(--c-text-secondary)] mb-2">Submitted Report & Image</h3>
                        <div className="space-y-4 rounded-lg border border-[var(--c-border)] p-4 bg-[var(--c-bg)]">
                        <p className="text-sm text-[var(--c-text-secondary)] whitespace-pre-wrap">{reportText || "No text report provided."}</p>
                        {image && (
                            <div className="pt-2">
                                <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Uploaded medical scan" className="rounded-lg max-w-full h-auto" />
                            </div>
                        )}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm uppercase tracking-wide text-[var(--c-text-secondary)] mb-2">Patient History</h3>
                        <div className="text-sm text-[var(--c-text-secondary)] space-y-2 rounded-lg border border-[var(--c-border)] p-4 bg-[var(--c-bg)]">
                            {hasHistory ? Object.entries(patientHistory).map(([key, value]) => {
                                return String(value).trim() && (
                                <p key={key}>
                                    <strong className="font-medium text-[var(--c-text-primary)]">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                                    </strong> {String(value)}
                                </p>
                            )}) : <p className="text-sm text-[var(--c-text-secondary)]">No patient history was provided.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <FinalReportComponent report={finalReport} />
              {SPECIALIST_AGENTS.map(agent => (
                <AgentCard
                  key={agent.name}
                  agent={agent}
                  report={specialistReports[agent.name]}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      <div id="printable-report" className="bg-white text-black font-sans" style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '20px', minHeight: '1120px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>AI Medical Diagnostic Report</h1>
          <p style={{textAlign: 'center', fontSize: '10px', marginBottom: '20px', color: '#555'}}>Generated on: {new Date().toLocaleDateString()}</p>
          <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>Patient & Report Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Patient History</h3>
                      {hasHistory ? (
                          <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                              {Object.entries(patientHistory).map(([key, value]) => String(value).trim() && (
                                  <p key={key} style={{ margin: '0 0 5px 0' }}>
                                      <strong style={{ fontWeight: 'bold' }}>
                                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                                      </strong> {String(value)}
                                  </p>
                              ))}
                          </div>
                      ) : <p style={{ fontSize: '12px' }}>No patient history was provided.</p>}
                  </div>
                  <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Submitted Report</h3>
                        <p style={{ fontSize: '12px', whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{reportText || "No text report provided."}</p>
                        {image && <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Submitted medical scan" style={{ maxWidth: '100%', borderRadius: '5px' }} />}
                  </div>
              </div>
          </div>

          {finalReport.status === 'complete' && (
              <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>Multidisciplinary Team Diagnosis</h2>
                  <div style={{ fontSize: '12px', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: finalReport.summary.replace(/\n/g, '<br />') }} />
              </div>
          )}

          <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>Specialist Analyses</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {SPECIALIST_AGENTS.map(agent => (
                      specialistReports[agent.name].status === 'complete' && (
                      <div key={agent.name} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px', pageBreakInside: 'avoid' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{agent.name} Report</h3>
                          {renderPrintableAnalysis(specialistReports[agent.name].analysis)}
                      </div>
                  )))}
              </div>
          </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;