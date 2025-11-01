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
    { key: 'pastDiagnoses', label: 'Past Diagnoses', placeholder: 'e.g., Hypertension' },
    { key: 'chronicConditions', label: 'Chronic Conditions', placeholder: 'e.g., Asthma' },
    { key: 'allergies', label: 'Allergies', placeholder: 'e.g., Penicillin, Peanuts' },
    { key: 'currentMedications', label: 'Current Medications', placeholder: 'e.g., Lisinopril 10mg' },
    { key: 'familyHistory', label: 'Family History', placeholder: 'e.g., Heart disease' },
    { key: 'lifestyleFactors', label: 'Lifestyle Factors', placeholder: 'e.g., Smoker, regular exercise' },
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
    <div className="w-full max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-[var(--c-surface)] p-8 rounded-2xl shadow-lg border border-[var(--c-border)]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
                 <div>
                    <label htmlFor="report-text" className="block text-sm font-medium text-[var(--c-text-primary)] mb-2">
                        Paste Medical Report
                    </label>
                    <textarea
                        id="report-text"
                        rows={14}
                        className="w-full p-4 border border-[var(--c-border)] rounded-lg bg-white focus:ring-2 focus:ring-[var(--c-primary)] focus:border-[var(--c-primary)] transition duration-150 ease-in-out text-[var(--c-text-primary)] placeholder:text-[var(--c-text-secondary)]"
                        placeholder="Enter patient's medical report here..."
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="relative flex items-center justify-center">
                    <span className="flex-grow border-t border-[var(--c-border)]"></span>
                    <span className="flex-shrink mx-4 text-[var(--c-text-secondary)] text-xs font-medium uppercase">OR</span>
                    <span className="flex-grow border-t border-[var(--c-border)]"></span>
                </div>
                 <div>
                    <label htmlFor="file-upload" className="w-full flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-[var(--c-border)] rounded-lg cursor-pointer bg-white hover:bg-[var(--c-bg)] transition">
                        <svg className="h-10 w-10 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span className="text-sm font-medium text-[var(--c-text-primary)]">
                            {fileName ? `Selected: ${fileName}` : 'Upload a .txt or Image file'}
                        </span>
                        <span className="text-xs text-[var(--c-text-secondary)] mt-1">Max 5MB</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,text/plain,image/jpeg,image/png,image/webp" disabled={isLoading} />
                    </label>
                    {imagePreview && (
                        <div className="mt-4 p-2 border border-[var(--c-border)] rounded-lg bg-[var(--c-bg)]">
                            <img src={imagePreview} alt="Uploaded preview" className="max-h-40 mx-auto rounded" />
                        </div>
                    )}
                </div>
            </div>
            <div className="lg:col-span-2 bg-[var(--c-bg)] border border-[var(--c-border)] rounded-lg p-6 space-y-4 h-fit">
                 <h3 className="font-semibold text-lg text-[var(--c-text-primary)]">Patient History</h3>
                 <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[var(--c-border)]">
                    {historyFormFields.map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-[var(--c-text-primary)] mb-1.5">
                                {label}
                            </label>
                            <textarea
                                id={key}
                                rows={key === 'lifestyleFactors' ? 3 : 2}
                                className="w-full p-2 border border-[var(--c-border)] rounded-md bg-white focus:ring-2 focus:ring-[var(--c-primary)] focus:border-[var(--c-primary)] transition text-sm text-[var(--c-text-primary)] placeholder:text-[var(--c-text-secondary)]"
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
        {error && <p className="text-sm text-[var(--c-error)] text-center pt-4">{error}</p>}
        <div className="mt-8 pt-6 border-t border-[var(--c-border)] flex justify-end">
            <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[var(--c-primary)] hover:bg-[var(--c-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--c-primary)] disabled:bg-opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : (
                'Generate Analysis'
                )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ReportInput;