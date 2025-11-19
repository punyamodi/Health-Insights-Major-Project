
import React, { useEffect, useState } from 'react';
import { LogoIcon } from './icons';
import SpecialtyIcon from './icons';
import { SPECIALIST_AGENTS } from '../constants';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden scroll-smooth">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-sky-100/40 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-teal-100/40 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/20">
              <LogoIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-800 tracking-tighter">Health Insights</span>
        </div>
        <button 
            onClick={onStart}
            className="hidden sm:block px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
            Launch App
        </button>
      </nav>

      <main className="relative z-10 flex flex-col items-center w-full">
        
        {/* Hero Section */}
        <section className="pt-12 pb-24 px-4 text-center max-w-5xl mx-auto">
            <div className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    Powered by Gemini 2.5 Flash & Pro
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                   The Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">Swarm Intelligence</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                    Upload your medical data and watch as 11 specialized AI agents analyze your case in real-time, controlled by a central medical director.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                    <button
                        onClick={onStart}
                        className="group w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/30 text-lg font-bold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden relative"
                    >
                        <span className="relative z-10">Start New Case</span>
                        <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>
        </section>

        {/* Agent Roster / Illustration Section */}
        <section className="py-20 w-full bg-white/50 backdrop-blur-sm border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet the Medical Board</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Your case is evaluated simultaneously by these specialized agents, ensuring no detail is overlooked.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {SPECIALIST_AGENTS.map((agent, index) => (
                        <div 
                            key={agent.name} 
                            className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-sky-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Decorative Background Blob */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-slate-50 to-sky-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                            
                            <div className="relative z-10">
                                {/* Icon Container */}
                                <div className="w-16 h-16 mb-6 rounded-2xl bg-slate-50 group-hover:bg-sky-50 border border-slate-100 group-hover:border-sky-100 flex items-center justify-center transition-colors duration-300">
                                    <SpecialtyIcon 
                                        specialty={agent.name} 
                                        className="w-8 h-8 text-slate-400 group-hover:text-sky-600 transition-colors duration-300" 
                                    />
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">
                                    {agent.name}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {agent.description}
                                </p>
                            </div>

                            {/* Hover line at bottom */}
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-sky-500 group-hover:w-full transition-all duration-300"></div>
                        </div>
                    ))}
                     {/* The Lead Agent Card */}
                     <div className="group relative bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden sm:col-span-2 lg:col-span-1 xl:col-span-1">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-700 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 mb-6 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                                   <LogoIcon className="w-8 h-8 text-teal-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Lead Diagnostician
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Synthesizes all specialist reports into a final, cohesive diagnosis and action plan.
                                </p>
                            </div>
                        </div>
                </div>
            </div>
        </section>

        {/* Workflow Visualization */}
        <section id="workflow" className="py-24 w-full relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Agentic Workflow Architecture</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">From raw data to final consensus.</p>
                </div>

                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                    
                    {/* Grid Background */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }}></div>

                    {/* Workflow Container */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-10">
                        
                        {/* 1. INPUT */}
                        <div className="flex flex-col items-center z-20 relative group">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center relative z-10">
                                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div className="mt-4 text-center bg-white/80 backdrop-blur px-3 py-1 rounded-lg">
                                <h3 className="font-bold text-slate-800 text-sm">Data Ingestion</h3>
                            </div>
                        </div>

                        {/* Arrow 1 */}
                        <div className="hidden md:flex flex-1 relative h-0.5 bg-slate-200 items-center justify-center">
                            <div className="absolute w-full h-full bg-gradient-to-r from-blue-500 to-teal-500 origin-left animate-[widthGrow_3s_infinite]"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-[travel_3s_infinite_linear] absolute left-0"></div>
                        </div>

                        {/* 2. AGENT SWARM */}
                        <div className="flex flex-col items-center z-20 relative group cursor-default">
                            <div className="w-64 h-64 relative flex items-center justify-center">
                                {/* Pulse Rings */}
                                <div className="absolute inset-0 border border-slate-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-8 border border-dashed border-slate-300 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                
                                {/* Central Hub */}
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full shadow-2xl flex items-center justify-center z-20 relative border-2 border-slate-700">
                                    <LogoIcon className="w-6 h-6 text-teal-400" />
                                </div>

                                {/* Orbiting Agents */}
                                {SPECIALIST_AGENTS.slice(0, 6).map((agent, i) => {
                                    const angle = (i / 6) * 2 * Math.PI;
                                    const r = 90; // Radius
                                    const x = Math.cos(angle) * r;
                                    const y = Math.sin(angle) * r;
                                    return (
                                        <div key={i} className="absolute w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center animate-float"
                                             style={{ 
                                                 transform: `translate(${x}px, ${y}px)`,
                                                 animationDelay: `${i * 0.2}s`
                                             }}>
                                            <SpecialtyIcon specialty={agent.name} className="w-5 h-5 text-slate-500" />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-2 text-center bg-white/80 backdrop-blur px-3 py-1 rounded-lg">
                                <h3 className="font-bold text-slate-800 text-sm">Parallel Analysis</h3>
                            </div>
                        </div>

                        {/* Arrow 2 */}
                        <div className="hidden md:flex flex-1 relative h-0.5 bg-slate-200 items-center justify-center">
                            <div className="absolute w-full h-full bg-gradient-to-r from-teal-500 to-slate-800 origin-left animate-[widthGrow_3s_infinite_1.5s]"></div>
                        </div>

                        {/* 3. OUTPUT */}
                        <div className="flex flex-col items-center z-20 relative group">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                                <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <div className="mt-4 text-center bg-white/80 backdrop-blur px-3 py-1 rounded-lg">
                                <h3 className="font-bold text-slate-800 text-sm">Final Report</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

      </main>
      
      <footer className="py-12 bg-slate-900 text-center text-slate-400">
        <div className="flex justify-center items-center gap-3 mb-6">
            <LogoIcon className="w-8 h-8 text-teal-400" />
            <span className="font-bold text-2xl text-white tracking-tight">Health Insights</span>
        </div>
        <p className="text-sm mb-2">© {new Date().getFullYear()} AI Diagnostic Systems. All rights reserved.</p>
        <p className="text-xs opacity-60 max-w-md mx-auto">Disclaimer: This tool is for demonstration and educational purposes only. It does not replace professional medical advice, diagnosis, or treatment.</p>
      </footer>

      <style>{`
        @keyframes widthGrow {
            0% { width: 0%; opacity: 0; }
            50% { width: 100%; opacity: 1; }
            100% { width: 100%; opacity: 0; }
        }
        @keyframes travel {
            0% { left: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
