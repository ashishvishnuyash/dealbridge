import React from 'react';
import { motion } from 'motion/react';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  setAgentWorkflow: (flow: string) => void;
  setBuyerWorkflow: (flow: string) => void;
}

export default function LandingPage({ setCurrentView, setAgentWorkflow, setBuyerWorkflow }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-16"
    >
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-8">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#005bc4]/5 border border-[#005bc4]/20 text-[#005bc4] rounded-full text-xs font-mono font-bold tracking-wide mb-6">
          <span className="material-symbols-outlined text-xs">verified</span>
          <span>Verified Network: 500+ Top Global Agencies</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="font-display text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight select-none"
        >
          Bridge the Gap Between <br className="hidden sm:inline" />
          <span className="text-[#005bc4]">Demand</span> and <span className="text-emerald-700">Inventory</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed font-sans font-medium"
        >
          The institutional exchange for enterprise estate brokers and sovereign wealth networks. Accelerated matching powered by high-fidelity ledger calculations.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
        >
          <button 
            onClick={() => {
              setAgentWorkflow('register');
              setCurrentView('agent');
            }}
            className="px-8 py-4 bg-[#0a2540] text-white hover:bg-[#14365c] rounded-lg font-display font-semibold transition-all hover:scale-[1.03] active:scale-95 shadow-[0_4px_14px_rgba(10,37,64,0.25)] flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Register as Agent</span>
            <span className="material-symbols-outlined text-sm font-semibold">arrow_forward</span>
          </button>
          <button 
            onClick={() => {
              setBuyerWorkflow('requirement');
              setCurrentView('buyer');
            }}
            className="px-8 py-4 border border-slate-300 hover:border-slate-400 text-slate-700 bg-white shadow-sm rounded-lg font-display font-semibold transition-all hover:scale-[1.03] hover:bg-slate-50/80 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Join as Portfolio Buyer</span>
            <span className="material-symbols-outlined text-sm">person_add</span>
          </button>
        </motion.div>
      </section>

      {/* Dual Entry Points Bento Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Agent Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: '#005bc4' }}
          className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-8 flex flex-col justify-between h-[420px] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-md"
        >
          {/* Watermark in background */}
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-slate-900">
            <span className="material-symbols-outlined text-[140px]">real_estate_agent</span>
          </div>

          <div className="relative z-10 space-y-4">
            <span className="text-[#005bc4] font-mono text-xs uppercase tracking-widest font-bold">Agent Gateway</span>
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">
              Post Inventory.<br />Manage Shadow Leads.
            </h2>
            <p className="text-slate-600 text-sm max-w-[85%] font-medium">
              Unlock unmatched speed-to-market. Syndicate your commercial listing into the closed Nexus ledger for immediate investor feedback.
            </p>
          </div>

          <div className="relative z-10 space-y-4 border-t border-slate-100 pt-6">
            <div className="flex gap-2 items-center text-[#005bc4] font-sans text-xs font-bold uppercase font-mono">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              <span>Audited Broking Channels Only</span>
            </div>
            <button 
              onClick={() => {
                setAgentWorkflow('login');
                setCurrentView('agent');
              }}
              className="w-full py-3.5 bg-[#0a2540] hover:bg-[#14365c] text-white rounded font-semibold text-sm flex justify-center items-center gap-2 transition-all cursor-pointer shadow-[0_2px_8px_rgba(10,37,64,0.15)]"
            >
              <span>Get Started as Agent</span>
              <span className="material-symbols-outlined text-sm">vpn_key</span>
            </button>
          </div>
        </motion.div>

        {/* Buyer Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: '#10b981' }}
          className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-8 flex flex-col justify-between h-[420px] transition-all shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-md"
        >
          {/* Watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-slate-900">
            <span className="material-symbols-outlined text-[140px]">apartment</span>
          </div>

          <div className="relative z-10 space-y-4">
            <span className="text-emerald-600 font-mono text-xs uppercase tracking-widest font-bold">Investor Gateway</span>
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">
              Submit Requirements.<br />Unlock matches.
            </h2>
            <p className="text-slate-600 text-sm max-w-[85%] font-medium">
              Direct capital routing. Configure location, purpose, and budgets variables to tap into off-registry shadow commercial inventory.
            </p>
          </div>

          <div className="relative z-10 space-y-4 border-t border-slate-100 pt-6">
            <div className="flex gap-2 items-center text-emerald-600 font-sans text-xs font-bold uppercase font-mono">
              <span className="material-symbols-outlined text-xs">finance</span>
              <span>Predictive Match Analytics V-Data</span>
            </div>
            <button 
              onClick={() => {
                setBuyerWorkflow('login');
                setCurrentView('buyer');
              }}
              className="w-full py-3.5 border border-emerald-600 hover:border-emerald-700 text-emerald-600 hover:text-emerald-700 font-semibold text-sm rounded bg-white hover:bg-emerald-50/40 flex justify-center items-center gap-2 transition-all cursor-pointer"
            >
              <span>Join as Buyer</span>
              <span className="material-symbols-outlined text-sm">lock</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16 -mx-6 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-display font-bold text-slate-950 tracking-tight">How Zsetu Works</h2>
            <p className="text-slate-500 text-xs font-mono font-bold tracking-wide uppercase">High-velocity matching protocol</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Steps */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 relative shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Connect Partners</h3>
              <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                Accredited real estate agents map verified inventory, while institutional investors deploy requirements on the matching engine.
              </p>
            </div>

            <div className="p-6 bg-white border border-emerald-500/30 rounded-xl space-y-4 relative shadow-[0_4px_16px_rgba(16,185,129,0.05)]">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-sm">
                <span className="material-symbols-outlined text-emerald-500 text-sm">diamond</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Ledger Scoring</h3>
              <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                A localized AI engine computes overlaps in alignment score, size limits, configurations, and transaction rules to output high-precision matches.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 relative shadow-[0_2px_12px_rgba(0,0,0,0.01)] font-sans">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Transact Securely</h3>
              <p className="text-slate-600 text-xs font-semibold leading-relaxed font-sans">
                Bypass traditional communication gaps. Direct buyer channels trigger Escrow Smart Contract pathways for immediate transaction flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof logos */}
      <section className="text-center space-y-6 animate-fade-in">
        <h4 className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-widest leading-none">Syndicated with tier-1 institutions</h4>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-70 hover:opacity-100 transition-opacity">
          <div className="font-display font-extrabold text-xl text-slate-800 tracking-widest font-mono">NEXUS CAP</div>
          <div className="font-display font-extrabold text-xl text-slate-800 tracking-widest font-mono">PRIME ASSET</div>
          <div className="font-display font-extrabold text-xl text-slate-800 tracking-widest font-mono">BEACON RE</div>
          <div className="font-display font-extrabold text-xl text-slate-800 tracking-widest font-mono">SKYLINE LTD</div>
          <div className="font-display font-extrabold text-xl text-slate-800 tracking-widest font-mono">ORBIT GRP</div>
        </div>
      </section>
    </motion.div>
  );
}
