import React from 'react';
import { marked } from 'marked';
import { FinalReport } from '../types';

interface FinalReportProps {
  report: FinalReport;
}

const FinalReportComponent: React.FC<FinalReportProps> = ({ report }) => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 bg-[var(--c-surface)] rounded-2xl shadow-lg border border-[var(--c-border)] p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[var(--c-text-primary)] mb-6">
        Multidisciplinary Team Diagnosis
      </h2>
      
      {report.status === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-[var(--c-primary)] space-y-4">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-center">Synthesizing reports and generating final diagnosis...</span>
          <p className="text-sm text-[var(--c-text-secondary)] text-center">This may take a moment, as the lead AI physician reviews all findings.</p>
        </div>
      )}

      {report.status === 'complete' && (
        <div 
          className="prose prose-slate max-w-none prose-h2:text-xl prose-h2:font-semibold prose-h3:font-semibold prose-li:marker:text-[var(--c-text-secondary)]" 
          dangerouslySetInnerHTML={{ __html: marked.parse(report.summary) as string }} 
        />
      )}

      {report.status === 'error' && (
         <p className="text-lg text-[var(--c-error)]">{report.summary}</p>
      )}

      {report.status === 'pending' && (
         <div className="min-h-[200px] flex items-center justify-center">
            <p className="text-base text-[var(--c-text-secondary)]">Awaiting specialist reports to generate final diagnosis.</p>
         </div>
      )}

    </div>
  );
};

export default FinalReportComponent;
