
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

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden scroll-smooth selection:bg-sky-200 selection:text-sky-900">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-sky-100/40 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-teal-100/40 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center space-x-3 group cursor-default">
            <div className="p-2 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <LogoIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-800 tracking-tighter group-hover:text-slate-900 transition-colors">Health Insights</span>
        </div>
        <div className="flex items-center gap-6">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hidden md:block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Capabilities</a>
            <a href="#specialists" onClick={(e) => scrollToSection(e, 'specialists')} className="hidden md:block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Specialists</a>
            <button 
                onClick={onStart}
                className="hidden sm:block px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
                Launch App
            </button>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center w-full">
        
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 text-center max-w-6xl mx-auto">
            <div className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/80 border border-sky-100 shadow-sm text-sky-700 text-sm font-semibold backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    Powered by Google Gemini 2.5 Pro & Flash
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.05]">
                   Medical Intelligence <br className="hidden md:block" />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500">Reimagined.</span>
                </h1>
                
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                    Harness the power of a <strong>Multidisciplinary AI Swarm</strong>. Upload complex medical data and receive a synthesized consensus from 11 specialized agents in real-time.
                </p>
                
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
                    <button
                        onClick={onStart}
                        className="group w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/30 text-lg font-bold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden relative"
                    >
                        <span className="relative z-10">Start Diagnostic Case</span>
                        <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    <button 
                        onClick={(e) => scrollToSection(e, 'how-it-works')}
                        className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                    >
                        View Architecture
                    </button>
                </div>

                <div className="mt-20 flex justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Tech Stack Strip Icons (Illustrative) */}
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                        <span>HIPAA Compliant Design</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        <span>Evidence-Based</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h2v5zm0 4h-2v-2h2v2z"/></svg>
                        <span>Client-Side Processing</span>
                    </div>
                </div>

            </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-white border-y border-slate-100 w-full">
            <div className="max-w-7xl mx-auto px-6">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Advanced Diagnostic Capabilities</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Beyond simple chatbots. A structured, multi-agent approach to medical analysis.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-8 rounded-2xl bg-slate-50 hover:bg-sky-50 transition-colors duration-300">
                        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Modal Analysis</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Capable of interpreting both unstructured clinical text reports and medical imagery (X-rays, MRIs, scans) simultaneously.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 hover:bg-teal-50 transition-colors duration-300">
                         <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Swarm Consensus</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Eleven specialists analyze the case independently. A "Lead Diagnostician" agent then synthesizes these viewpoints into one coherent report.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors duration-300">
                         <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Context-Aware Chat</h3>
                        <p className="text-slate-600 leading-relaxed">
                            After the report is generated, ask follow-up questions to an AI assistant that has full context of the diagnosis and patient history.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Workflow Visualization */}
        <section id="how-it-works" className="py-24 w-full relative overflow-hidden bg-slate-900 text-white">
            <div className="absolute inset-0 z-0">
                 <div className="absolute inset-0 bg-blue-900/10"></div>
                 <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Agentic Workflow Architecture</h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            Health Insights employs a star-topology distributed agent system. 
                            <br/><br/>
                            Data packets flow from the isolated specialist nodes (cardiology, neurology, etc.) into the central consensus engine. This ensures that every diagnosis is evaluated from multiple distinct medical perspectives before a final conclusion is reached.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-sm border border-blue-500/30">1</span>
                                <span className="font-medium text-slate-200">Data Ingestion & Formatting</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm border border-teal-500/30">2</span>
                                <span className="font-medium text-slate-200">Parallel Specialist Analysis (11 Agents)</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-500/30">3</span>
                                <span className="font-medium text-slate-200">Consensus Synthesis & Report Generation</span>
                            </div>
                        </div>
                    </div>

                    {/* Visualization Diagram */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-[340px] h-[340px] rounded-full flex items-center justify-center">
                            
                            {/* Central Hub */}
                            <div className="relative z-20 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.8)] flex items-center justify-center animate-pulse-slow">
                                <LogoIcon className="w-8 h-8 text-white" />
                            </div>

                            {/* Spokes and Agents */}
                            {[...Array(8)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="absolute top-1/2 left-1/2 w-[120px] h-[1px] origin-left"
                                    style={{ transform: `rotate(${i * 45}deg)` }}
                                >
                                    {/* Connection Line */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                                    
                                    {/* Agent Node */}
                                    <div className="absolute -right-2 -top-2 w-4 h-4 bg-slate-900 border border-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] z-10"></div>

                                    {/* Data Packet */}
                                    <div 
                                        className="absolute right-0 -top-1 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-flow-in z-20" 
                                        style={{ animationDelay: `${i * 0.3}s` }}
                                    ></div>
                                </div>
                            ))}
                            
                            {/* Rotating Ring */}
                             <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]"></div>
                             <div className="absolute inset-12 rounded-full border border-white/5"></div>

                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Agent Roster Section */}
        <section id="specialists" className="py-24 w-full bg-slate-50 border-t border-slate-200">
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
                            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {/* Decorative Background Blob */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-slate-50 to-sky-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100"></div>
                            
                            <div className="relative z-10">
                                {/* Icon Container */}
                                <div className="w-14 h-14 mb-5 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-100 group-hover:border-sky-100 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
                                    <SpecialtyIcon 
                                        specialty={agent.name} 
                                        className="w-7 h-7 text-slate-400 group-hover:text-sky-600 transition-colors duration-300" 
                                    />
                                </div>
                                
                                <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">
                                    {agent.name}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {agent.description}
                                </p>
                            </div>
                        </div>
                    ))}
                     {/* The Lead Agent Card */}
                     <div className="group relative bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden sm:col-span-2 lg:col-span-1 xl:col-span-1">
                            <div className="relative z-10">
                                <div className="w-14 h-14 mb-5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                                   <LogoIcon className="w-7 h-7 text-teal-400" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">
                                    Lead Diagnostician
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Synthesizes all specialist reports into a final, cohesive diagnosis and action plan.
                                </p>
                            </div>
                        </div>
                </div>
            </div>
        </section>

        {/* Use Cases / Audience */}
        <section className="py-24 bg-white border-y border-slate-100 w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="bg-sky-50 rounded-3xl p-10 border border-sky-100">
                        <h3 className="text-2xl font-bold text-sky-900 mb-4">For Medical Professionals</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-sky-800">Rapidly triage complex cases with multi-specialty overview.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-sky-800">Reduce diagnostic error by cross-referencing findings.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-sky-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-sky-800">Draft comprehensive patient reports in seconds.</span>
                            </li>
                        </ul>
                     </div>
                     <div className="bg-teal-50 rounded-3xl p-10 border border-teal-100">
                        <h3 className="text-2xl font-bold text-teal-900 mb-4">For Researchers & Students</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-teal-800">Visualize how different specialties approach the same dataset.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-teal-800">Simulate rare case scenarios for educational purposes.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-teal-800">Explore the intersection of AI and clinical pathology.</span>
                            </li>
                        </ul>
                     </div>
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 w-full text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Analyze Your First Case?</h2>
                <p className="text-xl text-slate-600 mb-10 font-light">
                    Join the future of diagnostics. Upload your data and let the swarm provide insights.
                </p>
                <button
                    onClick={onStart}
                    className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                    Launch Health Insights
                </button>
            </div>
        </section>

      </main>
      
      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="flex justify-center items-center gap-3 mb-6 opacity-80">
            <LogoIcon className="w-6 h-6 text-slate-800" />
            <span className="font-bold text-xl text-slate-800 tracking-tight">Health Insights</span>
        </div>
        <div className="flex justify-center gap-6 mb-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-800">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800">Terms of Service</a>
            <a href="#" className="hover:text-slate-800">Research Paper</a>
        </div>
        <p className="text-sm text-slate-400 mb-2">© {new Date().getFullYear()} AI Diagnostic Systems. All rights reserved.</p>
        <p className="text-xs text-slate-400 max-w-md mx-auto px-4">
            Disclaimer: This tool is for demonstration and educational purposes only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
