import React from 'react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  agentLoggedIn: boolean;
  buyerLoggedIn: boolean;
}

export default function Header({ currentView, setCurrentView, agentLoggedIn, buyerLoggedIn }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm flex justify-between items-center h-[#64px] px-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setCurrentView('landing')} 
          className="flex items-center gap-2 text-[#005bc4] cursor-pointer hover:opacity-90 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[28px] text-[#005bc4]" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
          <h1 className="font-display text-lg font-extrabold tracking-tight text-[#0a2540]">Zsetu</h1>
        </button>
      </div>

      {/* Navigation center tabs for larger screens */}
      <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60">
        <button 
          onClick={() => setCurrentView('landing')}
          className={`px-4 py-1.5 text-xs font-mono font-semibold tracking-wider rounded uppercase transition-all duration-200 ${
            currentView === 'landing' ? 'bg-white text-[#005bc4] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentView('agent')}
          className={`px-4 py-1.5 text-xs font-mono font-semibold tracking-wider rounded uppercase transition-all duration-200 ${
            currentView === 'agent' ? 'bg-white text-[#005bc4] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Agent Portal {agentLoggedIn && '●'}
        </button>
        <button 
          onClick={() => setCurrentView('buyer')}
          className={`px-4 py-1.5 text-xs font-mono font-semibold tracking-wider rounded uppercase transition-all duration-200 ${
            currentView === 'buyer' ? 'bg-white text-[#005bc4] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Buyer Room {buyerLoggedIn && '●'}
        </button>
        <button 
          onClick={() => setCurrentView('explore')}
          className={`px-4 py-1.5 text-xs font-mono font-semibold tracking-wider rounded uppercase transition-all duration-200 ${
            currentView === 'explore' ? 'bg-white text-[#005bc4] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Market Feed
        </button>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`px-4 py-1.5 text-xs font-mono font-semibold tracking-wider rounded uppercase transition-all duration-200 ${
            currentView === 'dashboard' ? 'bg-white text-[#005bc4] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Live Stats
        </button>
      </nav>

      <div className="flex items-center gap-4">
        {/* Verification Check Status */}
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-slate-50 border border-slate-200 text-emerald-600 px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          LEDGER ONLINE
        </span>

        {/* User profile picture */}
        <div 
          onClick={() => setCurrentView(buyerLoggedIn ? 'buyer' : 'agent')} 
          className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 cursor-pointer active:scale-95 transition-transform"
        >
          <img 
            alt="Profile Avatar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWOl1KhiIIsqVIjGMmbHztTDRvgAVTySfTqq_7FxiORGjecUplV9ntxAo-spyJjnANL4XM1GNM_5PSa6oo3S6JMBe-LfH0Xy2z1dhmBLUxtdPmjeMLBMMJJ1vMrlYhZTljO0bxNoPIYNSLWENEl0QJdwdVbVD_xhBz3Ia2mgtLIQvViix3lKlTPPjcd-rcLLaqj7qJsJXY6SkT4b4sf_4J1lqxN4W7X9Urr2tvnvpToLSzGmEiWIzyOSr_fVCwckG3oOG_WUwt-NPD" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
