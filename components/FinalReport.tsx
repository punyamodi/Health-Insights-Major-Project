
import React from 'react';
import { marked } from 'marked';
import { FinalReport } from '../types';
import { LogoIcon } from './icons';

interface FinalReportProps {
  report: FinalReport;
}

const FinalReportComponent: React.FC<FinalReportProps> = ({ report }) => {
  return (
    <div className="bg-white rounded-none sm:rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      {/* Report Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                 <LogoIcon className="w-8 h-8 text-teal-400" />
              </div>
              <div>
                  <h2 className="text-2xl font-bold tracking-tight">Medical Consensus Report</h2>
                  <p className="text-slate-400 text-sm">Integrated Multi-Agent Diagnosis</p>
              </div>
          </div>
          {report.status === 'complete' && (
            <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                FINALIZED
            </div>
          )}
      </div>

      {/* Report Content */}
      <div className="p-6 sm:p-10 min-h-[400px]">
        {report.status === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[var(--c-primary)] rounded-full border-t-transparent animate-spin"></div>
                    <LogoIcon className="absolute inset-0 m-auto w-6 h-6 text-[var(--c-primary)] animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800">Synthesizing Specialist Reports</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">The lead medical AI is reviewing findings from all active agents to generate a cohesive diagnosis.</p>
                </div>
            </div>
        )}

        {report.status === 'complete' && (
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 pb-6 border-b border-slate-100 flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Report Type</p>
                        <p className="font-serif text-xl text-slate-800 italic">Comprehensive Diagnostic Assessment</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</p>
                        <p className="text-sm text-slate-800">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div 
                className="prose prose-slate prose-lg max-w-none 
                    prose-headings:font-bold prose-headings:text-slate-900 
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
                    prose-h3:text-lg prose-h3:text-[var(--c-primary-dark)] prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-6
                    prose-p:leading-relaxed prose-p:text-slate-700
                    prose-li:text-slate-700 prose-strong:text-slate-900
                    prose-blockquote:border-l-4 prose-blockquote:border-[var(--c-primary)] prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic" 
                dangerouslySetInnerHTML={{ __html: marked.parse(report.summary) as string }} 
                />
                
                <div className="mt-12 pt-8 border-t-2 border-slate-100 flex items-center justify-center gap-2 opacity-50">
                    <LogoIcon className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-400 font-medium">End of Clinical Report • Health Insights AI</p>
                </div>
            </div>
        )}

        {report.status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                    <h3 className="font-bold text-red-800">Generation Error</h3>
                    <p className="text-red-600 mt-1 text-sm">{report.summary}</p>
                </div>
            </div>
        )}

        {report.status === 'pending' && (
            <div className="flex items-center justify-center h-40 text-slate-400 italic border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                Awaiting data from specialist agents...
            </div>
        )}
      </div>
    </div>
  );
};

export default FinalReportComponent;
