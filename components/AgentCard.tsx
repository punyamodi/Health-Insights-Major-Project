import React, { useState, useEffect } from 'react';
import SpecialtyIcon, { ChevronDownIcon, ChevronUpIcon } from './icons';
import { Agent, SpecialistReport } from '../types';

interface AgentCardProps {
  agent: Agent;
  report: SpecialistReport;
}

const renderAnalysis = (analysis: SpecialistReport['analysis']) => {
  if (typeof analysis === 'string') {
    return <p className="text-sm text-[var(--c-error)]">{analysis}</p>;
  }

  if (analysis && typeof analysis === 'object') {
    const { keyFindings, potentialConditions, recommendations } = analysis;
    const hasContent = (arr: string[] | undefined) => arr && arr.length > 0;
    
    if (!hasContent(keyFindings) && !hasContent(potentialConditions) && !hasContent(recommendations)) {
        return <p className="text-sm text-[var(--c-text-secondary)]">No specific findings for this specialty.</p>
    }

    return (
      <div className="space-y-4 text-sm">
        {hasContent(keyFindings) && (
            <div>
            <h4 className="font-semibold text-[var(--c-text-primary)] mb-2 text-xs uppercase tracking-wider">Key Findings</h4>
            <ul className="list-disc list-inside text-[var(--c-text-secondary)] space-y-1.5">
                {keyFindings?.map((item, index) => <li key={`kf-${index}`}>{item}</li>)}
            </ul>
            </div>
        )}
        {hasContent(potentialConditions) && (
            <div>
            <h4 className="font-semibold text-[var(--c-text-primary)] mb-2 text-xs uppercase tracking-wider">Potential Conditions</h4>
            <ul className="list-disc list-inside text-[var(--c-text-secondary)] space-y-1.5">
                {potentialConditions?.map((item, index) => <li key={`pc-${index}`}>{item}</li>)}
            </ul>
            </div>
        )}
        {hasContent(recommendations) && (
            <div>
            <h4 className="font-semibold text-[var(--c-text-primary)] mb-2 text-xs uppercase tracking-wider">Recommendations</h4>
            <ul className="list-disc list-inside text-[var(--c-text-secondary)] space-y-1.5">
                {recommendations?.map((item, index) => <li key={`r-${index}`}>{item}</li>)}
            </ul>
            </div>
        )}
      </div>
    );
  }

  return null;
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, report }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Expand the card by default when analysis is complete
    if (report.status === 'complete') {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [report.status]);

  const getStatusInfo = (): { color: string, text: string, animate: boolean } => {
    switch(report.status) {
        case 'complete': return { color: 'var(--c-success)', text: 'Complete', animate: false };
        case 'loading': return { color: 'var(--c-primary)', text: 'Analyzing...', animate: true };
        case 'error': return { color: 'var(--c-error)', text: 'Error', animate: false };
        default: return { color: 'var(--c-text-secondary)', text: 'Pending', animate: false };
    }
  }

  const { color, text, animate } = getStatusInfo();

  return (
    <div className="bg-[var(--c-surface)] rounded-2xl overflow-hidden shadow-md border border-[var(--c-border)] transition-all duration-300">
      <button 
        className="w-full p-5 text-left" 
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={report.status !== 'complete'}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-full bg-[var(--c-bg)]">
                <SpecialtyIcon specialty={agent.name} className="text-[var(--c-text-secondary)]" />
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-[var(--c-text-primary)]">{agent.name}</div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                <p className={`text-xs font-medium ${animate ? 'animate-pulse' : ''}`} style={{ color: color }}>
                    {text}
                </p>
              </div>
            </div>
          </div>
          {report.status === 'complete' && (
            <div className="text-[var(--c-text-secondary)]">
                {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </div>
          )}
        </div>
      </button>

      {isExpanded && report.status === 'complete' && (
        <div className="px-5 pb-5 mt-2 border-t border-[var(--c-border)] pt-4">
          {renderAnalysis(report.analysis)}
        </div>
      )}

      {report.status === 'error' && (
        <div className="px-5 pb-5 mt-2 border-t border-[var(--c-border)] pt-4">
          <p className="text-sm text-[var(--c-error)]">{typeof report.analysis === 'string' ? report.analysis : "An unknown error occurred."}</p>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
