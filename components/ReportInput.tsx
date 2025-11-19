import React, { useState, useCallback } from 'react';
import { PatientHistory } from '../types';

interface ReportInputProps {
  onSubmit: (reportText: string, history: PatientHistory, image: { base64: string; mimeType: string } | null) => void;
  isLoading: boolean;
}

const initialPatientHistory: PatientHistory = {
  pastDiagnoses: '',
  chronicConditions: '',
  allergies: '',
  currentMedications: '',
  familyHistory: '',
  lifestyleFactors: '',
};

const historyFormFields: { key: keyof PatientHistory, label: string, placeholder: string }[] = [
    { key: 'pastDiagnoses', label: 'Past Diagnoses', placeholder: 'e.g., Hypertension, T2 Diabetes' },
    { key: 'chronicConditions', label: 'Chronic Conditions', placeholder: 'e.g., Asthma, Arthritis' },
    { key: 'allergies', label: 'Allergies', placeholder: 'e.g., Penicillin, Peanuts, Latex' },
    { key: 'currentMedications', label: 'Current Medications', placeholder: 'e.g., Lisinopril 10mg, Metformin' },
    { key: 'familyHistory', label: 'Family History', placeholder: 'e.g., Maternal heart disease' },
    { key: 'lifestyleFactors', label: 'Lifestyle Factors', placeholder: 'e.g., Smoker, Vegan, Sedentary' },
];

const ReportInput: React.FC<ReportInputProps> = ({ onSubmit, isLoading }) => {
  const [reportText, setReportText] = useState('');
  const [patientHistory, setPatientHistory] = useState<PatientHistory>(initialPatientHistory);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageForApi, setImageForApi] = useState<{ base64: string; mimeType: string } | null>(null);

  const handleHistoryChange = (key: keyof PatientHistory, value: string) => {
    setPatientHistory(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Please select a file smaller than 5MB.');
      return;
    }
    setError('');
    setFileName(file.name);

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (dataUrl) {
                const base64String = dataUrl.split(',')[1];
                setImageForApi({ base64: base64String, mimeType: file.type });
                setImagePreview(dataUrl);
            } else {
                setError('Error reading image file.');
            }
        };
        reader.onerror = () => setError('Error reading image file.');
        reader.readAsDataURL(file);
    } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
            setReportText(e.target?.result as string);
        };
        reader.onerror = () => setError('Error reading text file.');
        reader.readAsText(file);
    } else {
        setError('Unsupported file type. Please upload a .txt or image file.');
    }
    event.target.value = '';
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportText.trim() && !imageForApi) {
      setError('Please provide a medical report by pasting text or uploading a file.');
      return;
    }
    setError('');
    onSubmit(reportText, patientHistory, imageForApi);
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-slideInBottom">
      <form onSubmit={handleSubmit} className="bg-[var(--c-surface)] rounded-2xl shadow-xl border border-[var(--c-border)] overflow-hidden">
        
        <div className="bg-slate-50/80 px-8 py-6 border-b border-[var(--c-border)] backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[var(--c-text-primary)]">New Case Entry</h2>
            <p className="text-sm text-[var(--c-text-secondary)] mt-1">Enter clinical data and patient history to initialize the Multi-Agent Diagnostic Swarm.</p>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Report & File */}
            <div className="lg:col-span-7 space-y-6">
                 <div>
                    <label htmlFor="report-text" className="block text-sm font-bold text-[var(--c-text-primary)] mb-2 uppercase tracking-wide">
                        Clinical Notes / Medical Report
                    </label>
                    <div className="relative group">
                        <textarea
                            id="report-text"
                            rows={12}
                            className="w-full p-4 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[var(--c-primary)] focus:border-transparent transition duration-200 ease-in-out text-[var(--c-text-primary)] placeholder:text-slate-400 resize-none shadow-sm group-hover:border-slate-400"
                            placeholder="Paste the patient's medical report, symptoms, or clinical observations here..."
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            disabled={isLoading}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                            {reportText.length} chars
                        </div>
                    </div>
                </div>

                 <div className="bg-sky-50 rounded-xl border border-sky-100 p-4">
                    <label htmlFor="file-upload" className="group relative w-full flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-sky-300 rounded-lg cursor-pointer hover:bg-sky-100 transition-colors duration-200">
                        <div className="flex flex-col items-center">
                            <svg className="h-10 w-10 text-[var(--c-primary)] mb-3 group-hover:scale-110 transition-transform duration-200" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span className="text-sm font-bold text-[var(--c-primary-dark)]">
                                {fileName ? `File Selected: ${fileName}` : 'Upload Scan or Text File'}
                            </span>
                            <span className="text-xs text-[var(--c-text-secondary)] mt-1">Supports: .txt, .png, .jpg, .webp (Max 5MB)</span>
                        </div>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,text/plain,image/jpeg,image/png,image/webp" disabled={isLoading} />
                    </label>
                    {imagePreview && (
                        <div className="mt-4 relative group">
                            <img src={imagePreview} alt="Uploaded preview" className="h-48 w-full object-cover rounded-lg border border-sky-200 shadow-sm" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-5">
                <div className="bg-slate-50 border border-[var(--c-border)] rounded-xl p-6 h-full">
                     <h3 className="font-bold text-[var(--c-text-primary)] mb-5 flex items-center uppercase tracking-wide text-sm">
                        <div className="p-1.5 bg-teal-100 rounded-md mr-2 text-teal-700">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </div>
                        Patient History
                     </h3>
                     <div className="space-y-5">
                        {historyFormFields.map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    id={key}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[var(--c-primary)] focus:border-transparent transition text-sm text-[var(--c-text-primary)] placeholder:text-slate-400 shadow-sm"
                                    placeholder={placeholder}
                                    value={patientHistory[key]}
                                    onChange={(e) => handleHistoryChange(key, e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {error && (
            <div className="px-8 pb-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-slate-50 px-8 py-6 border-t border-[var(--c-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-xs text-slate-500 italic">
                * This tool uses AI for diagnostic assistance. Always verify with clinical professionals.
            </p>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex justify-center items-center py-3.5 px-8 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-[var(--c-primary)] hover:bg-[var(--c-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--c-primary)] disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Initializing Agents...
                    </span>
                ) : (
                'Analyze Case'
                )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ReportInput;