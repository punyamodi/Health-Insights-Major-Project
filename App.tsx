
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReportInput from './components/ReportInput';
import AgentCard from './components/AgentCard';
import FinalReportComponent from './components/FinalReport';
import LandingPage from './components/LandingPage';
import ChatBot from './components/ChatBot';
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

const renderPrintableAnalysis = (analysis: SpecialistReport['analysis']) => {
    if (!analysis) return null;
    if (typeof analysis === 'string') {
        return <p style={{ fontSize: '12px', color: '#ef4444' }}>{analysis}</p>;
    }
    
    return (
        <div style={{ fontSize: '12px' }}>
            {analysis.summary && <p style={{ fontStyle: 'italic', marginBottom: '8px', color: '#475569' }}>"{analysis.summary}"</p>}
            
            {analysis.keyFindings && analysis.keyFindings.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#334155', fontSize: '11px', textTransform: 'uppercase' }}>Key Findings:</strong>
                    <ul style={{ margin: '2px 0 0 15px', padding: 0 }}>
                        {analysis.keyFindings.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
            )}
            {analysis.potentialConditions && analysis.potentialConditions.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#334155', fontSize: '11px', textTransform: 'uppercase' }}>Potential Conditions:</strong>
                    <ul style={{ margin: '2px 0 0 15px', padding: 0 }}>
                        {analysis.potentialConditions.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </div>
            )}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                    <strong style={{ color: '#334155', fontSize: '11px', textTransform: 'uppercase' }}>Recommendations:</strong>
                    <ul style={{ margin: '2px 0 0 15px', padding: 0 }}>
                        {analysis.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

const initialPatientHistory: PatientHistory = {
  pastDiagnoses: '',
  chronicConditions: '',
  allergies: '',
  currentMedications: '',
  familyHistory: '',
  lifestyleFactors: '',
};

type TabView = 'consensus' | 'specialists' | 'records';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'main'>('landing');
  const [activeTab, setActiveTab] = useState<TabView>('specialists');
  const [caseId, setCaseId] = useState<string>(() => new Date().getTime().toString().slice(-6));
  
  const [reportText, setReportText] = useState<string>('');
  const [patientHistory, setPatientHistory] = useState<PatientHistory>(initialPatientHistory);
  const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);

  const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const initialSpecialistReports = SPECIALIST_AGENTS.reduce((acc, agent) => {
    acc[agent.name] = { specialty: agent.name, analysis: null, status: 'pending' };
    return acc;
  }, {} as Record<MedicalSpecialty, SpecialistReport>);

  const [specialistReports, setSpecialistReports] = useState<Record<MedicalSpecialty, SpecialistReport>>(initialSpecialistReports);
  const [finalReport, setFinalReport] = useState<FinalReport>({ summary: '', status: 'pending' });

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState('');

  // Auto-switch tabs when final report is ready
  useEffect(() => {
    if (finalReport.status === 'complete') {
        setActiveTab('consensus');
        const context = `
        **Patient History:**
        ${JSON.stringify(patientHistory)}

        **Original Report:**
        ${reportText}

        **Final Diagnosis:**
        ${finalReport.summary}

        **Specialist Findings:**
        ${(Object.values(specialistReports) as SpecialistReport[]).filter(r => r.status === 'complete').map(r => `${r.specialty}: ${JSON.stringify(r.analysis)}`).join('\n')}
        `;
        setChatContext(context);
    }
  }, [finalReport.status, specialistReports, patientHistory, reportText]);

  const resetState = () => {
    setReportText('');
    setPatientHistory(initialPatientHistory);
    setImage(null);
    setAnalysisStarted(false);
    setIsLoading(false);
    setSpecialistReports(initialSpecialistReports);
    setFinalReport({ summary: '', status: 'pending' });
    setChatContext('');
    setIsChatOpen(false);
    setActiveTab('specialists');
    setCaseId(new Date().getTime().toString().slice(-6));
    setView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStart = () => {
      resetState();
  };

  const handleReportSubmit = useCallback(async (text: string, history: PatientHistory, img: { base64: string; mimeType: string } | null) => {
    setReportText(text);
    setPatientHistory(history);
    setImage(img);
    
    setInitializing(true);
    window.scrollTo(0, 0);
    
    setTimeout(() => {
        setAnalysisStarted(true);
        setInitializing(false);
        setActiveTab('specialists');
    }, 1500);

    setIsLoading(true);

    setSpecialistReports(prev => {
        const next = { ...prev };
        SPECIALIST_AGENTS.forEach(agent => {
            next[agent.name] = { ...next[agent.name], status: 'loading' };
        });
        return next;
    });

    const agentPromises = SPECIALIST_AGENTS.map(agent => {
        return analyzeWithSpecialistAgent(agent.name, text, history, img)
            .then((analysis) => {
                const isError = typeof analysis === 'string';
                setSpecialistReports(prev => ({
                    ...prev,
                    [agent.name]: { 
                        specialty: agent.name, 
                        analysis, 
                        status: isError ? 'error' : 'complete' 
                    }
                }));
                return { specialty: agent.name, analysis, error: isError };
            })
            .catch((error: any) => {
                const errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
                setSpecialistReports(prev => ({
                    ...prev,
                    [agent.name]: { 
                        specialty: agent.name, 
                        analysis: errorMessage, 
                        status: 'error' 
                    }
                }));
                return { specialty: agent.name, analysis: errorMessage, error: true };
            });
    });

    const results = await Promise.all(agentPromises);
    
    const successfulReports: Record<string, SpecialistAnalysis> = {};
    results.forEach(res => {
        if (!res.error && typeof res.analysis === 'object') {
            successfulReports[res.specialty] = res.analysis as SpecialistAnalysis;
        }
    });

    setFinalReport({ summary: '', status: 'loading' });
    try {
      const finalDiagnosis = await generateFinalDiagnosis(successfulReports, text, history);
      setFinalReport({ summary: finalDiagnosis, status: 'complete' });
    } catch (error: any) {
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
        await new Promise(resolve => setTimeout(resolve, 500));

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

        pdf.save(`Health_Insights_Report_${caseId}.pdf`);

    } catch (error: any) {
        console.error("Error exporting to PDF:", error);
    } finally {
        setIsExporting(false);
    }
  };

  const hasHistory = Object.values(patientHistory).some(field => String(field).trim() !== '');
  const completedAgents = Object.values(specialistReports).filter(r => r.status === 'complete').length;
  const totalAgents = SPECIALIST_AGENTS.length;

  const Header = () => (
    <header className="bg-white/95 backdrop-blur-md fixed w-full top-0 z-[100] border-b border-[var(--c-border)] shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('landing')}>
                <div className="bg-gradient-to-tr from-blue-600 to-teal-400 p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                    <LogoIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-800 tracking-tight">Health Insights</span>
            </div>
            {view === 'main' && (
                 <div className="flex items-center space-x-3">
                    {finalReport.status === 'complete' && (
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="hidden sm:flex px-4 py-2 text-xs font-bold bg-[var(--c-secondary)] text-white rounded-full hover:bg-teal-700 transition-all shadow-md hover:shadow-lg disabled:bg-opacity-60 disabled:cursor-not-allowed items-center gap-2"
                    >
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {isExporting ? 'Exporting...' : 'Download PDF'}
                    </button>
                    )}
                    <button
                        onClick={resetState}
                        className="px-4 py-2 text-xs font-semibold bg-white border border-gray-200 text-slate-700 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                        New Case
                    </button>
                </div>
            )}
        </div>
    </header>
  );

  const TabButton = ({ id, label, icon }: { id: TabView, label: string, icon: any }) => (
      <button
          onClick={() => setActiveTab(id)}
          className={`flex-1 sm:flex-none relative px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 rounded-t-lg ${
              activeTab === id 
              ? 'text-[var(--c-primary)] bg-white border-b-2 border-[var(--c-primary)]' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
      >
          {icon}
          <span>{label}</span>
          {id === 'specialists' && activeTab !== 'specialists' && (
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{completedAgents}/{totalAgents}</span>
          )}
      </button>
  );

  if (view === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg)] text-[var(--c-text-primary)] font-sans flex flex-col">
      <Header />
      
      <main className="container mx-auto flex-grow relative z-0 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Initializing Overlay */}
        {initializing && (
             <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-t-4 border-[var(--c-primary)] rounded-full animate-spin"></div>
                    <div className="absolute inset-3 border-t-4 border-[var(--c-secondary)] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Initializing Protocol</h2>
                <p className="text-slate-500 mt-2 text-sm">Dispatching to specialist agents...</p>
             </div>
        )}

        {!analysisStarted ? (
            <div className="max-w-5xl mx-auto animate-slideInBottom py-8">
                <ReportInput onSubmit={handleReportSubmit} isLoading={isLoading} />
            </div>
        ) : (
          <div className={`transition-opacity duration-700 max-w-7xl mx-auto ${initializing ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Status Bar */}
            <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-slideInBottom">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                         <h1 className="text-lg font-bold text-slate-900">Case Analysis #{caseId}</h1>
                         <p className="text-sm text-slate-500">
                            {finalReport.status === 'complete' ? 'Assessment Finalized' : 'Multi-Agent Processing Active'}
                         </p>
                    </div>
                 </div>
                 
                 {/* Progress Indicators */}
                 <div className="flex items-center gap-6 w-full md:w-auto">
                     <div className="flex-1 md:flex-none">
                         <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                             <span>Specialist Consensus</span>
                             <span>{Math.round((completedAgents / totalAgents) * 100)}%</span>
                         </div>
                         <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-[var(--c-primary)] transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${(completedAgents / totalAgents) * 100}%` }}
                             ></div>
                         </div>
                     </div>
                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors duration-300 ${finalReport.status === 'complete' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                         <span className={`block w-2 h-2 rounded-full ${finalReport.status === 'complete' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></span>
                         {finalReport.status === 'complete' ? 'COMPLETE' : 'LIVE'}
                     </div>
                 </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-8 flex flex-col sm:flex-row gap-1">
                <TabButton 
                    id="consensus" 
                    label="Diagnostic Consensus" 
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <TabButton 
                    id="specialists" 
                    label="Specialist Board" 
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <TabButton 
                    id="records" 
                    label="Patient Records" 
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                />
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'consensus' && (
                    <div className="animate-slideInBottom">
                        <FinalReportComponent report={finalReport} />
                    </div>
                )}

                {activeTab === 'specialists' && (
                    <div className="animate-slideInBottom grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                        {SPECIALIST_AGENTS.map(agent => (
                            <AgentCard
                            key={agent.name}
                            agent={agent}
                            report={specialistReports[agent.name]}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'records' && (
                    <div className="animate-slideInBottom bg-white rounded-2xl shadow-sm border border-[var(--c-border)] p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Input Clinical Data</h3>
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-mono">
                                    {reportText || "No text report provided."}
                                </div>
                                {image && (
                                    <div className="mt-6">
                                        <h4 className="text-xs font-bold text-slate-500 mb-2">Attached Imagery</h4>
                                        <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Uploaded medical scan" className="rounded-lg border border-slate-200 shadow-sm max-h-64 object-contain bg-black" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Patient History Profile</h3>
                                <div className="space-y-0 divide-y divide-slate-100">
                                    {hasHistory ? Object.entries(patientHistory).map(([key, value]) => {
                                        return String(value).trim() && (
                                        <div key={key} className="py-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </p> 
                                            <p className="text-base text-slate-800 font-medium">{String(value)}</p>
                                        </div>
                                    )}) : <p className="text-sm text-slate-400 italic py-4">No patient history recorded.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

          </div>
        )}
      </main>

      {/* Chat Bot */}
      {analysisStarted && (
          <ChatBot 
            context={chatContext} 
            isOpen={isChatOpen} 
            setIsOpen={setIsChatOpen} 
          />
      )}

      {/* Hidden Printable Section (Preserved for PDF Generation) */}
      <div id="printable-report" className="bg-white text-black font-sans" style={{ position: 'absolute', left: '-9999px', width: '800px', padding: '40px', minHeight: '1120px' }}>
          <div style={{borderBottom: '2px solid #0284c7', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Health Insights Report</h1>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>AI-Powered Multi-Agent Diagnostic Analysis</p>
              </div>
              <div style={{textAlign: 'right'}}>
                 <p style={{ fontSize: '12px', color: '#94a3b8' }}>Date: {new Date().toLocaleDateString()}</p>
                 <p style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {caseId}</p>
              </div>
          </div>

          <div style={{ marginBottom: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px', color: '#334155' }}>Patient & Case Data</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#64748b', textTransform: 'uppercase' }}>History</h3>
                      {hasHistory ? (
                          <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                              {Object.entries(patientHistory).map(([key, value]) => String(value).trim() && (
                                  <p key={key} style={{ margin: '0 0 6px 0' }}>
                                      <span style={{ fontWeight: 'bold', color: '#475569' }}>
                                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                                      </span> <span style={{color: '#0f172a'}}>{String(value)}</span>
                                  </p>
                              ))}
                          </div>
                      ) : <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No history recorded.</p>}
                  </div>
                  <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#64748b', textTransform: 'uppercase' }}>Clinical Notes</h3>
                        <p style={{ fontSize: '12px', whiteSpace: 'pre-wrap', marginBottom: '10px', color: '#0f172a', lineHeight: 1.6 }}>{reportText || "No notes provided."}</p>
                        {image && <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Scan" style={{ maxWidth: '100%', borderRadius: '4px', border: '1px solid #e2e8f0', marginTop: '10px' }} />}
                  </div>
              </div>
          </div>

          {finalReport.status === 'complete' && (
              <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0284c7', marginBottom: '15px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Final Diagnostic Consensus</h2>
                  <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#334155' }} dangerouslySetInnerHTML={{ __html: finalReport.summary.replace(/\n/g, '<br />') }} />
              </div>
          )}

          <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Specialist Findings</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {SPECIALIST_AGENTS.map(agent => (
                      specialistReports[agent.name].status === 'complete' && (
                      <div key={agent.name} style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', pageBreakInside: 'avoid' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px', color: '#0369a1', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>{agent.name}</h3>
                          {renderPrintableAnalysis(specialistReports[agent.name].analysis)}
                      </div>
                  )))}
              </div>
          </div>
          
          <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
              <p>Generated by Health Insights AI System. This report is for informational purposes only and does not constitute a final medical diagnosis.</p>
          </div>
      </div>
    </div>
  );
};

export default App;
