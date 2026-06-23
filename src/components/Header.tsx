import React, { useState } from 'react';
import { Agent, Buyer } from '../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  agentLoggedIn: boolean;
  buyerLoggedIn: boolean;
  agent?: Agent;
  buyer?: Buyer;
  onLogoutAgent: () => void;
  onLogoutBuyer: () => void;
}

export default function Header({ 
  currentView, 
  setCurrentView, 
  agentLoggedIn, 
  buyerLoggedIn,
  agent,
  buyer,
  onLogoutAgent,
  onLogoutBuyer
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

        {/* User profile picture or Portal access */}
        {(agentLoggedIn || buyerLoggedIn) ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#005bc4] cursor-pointer active:scale-95 transition-transform flex items-center justify-center focus:outline-none"
            >
              <img 
                alt="Profile Avatar" 
                src={buyerLoggedIn ? (buyer?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAWOl1KhiIIsqVIjGMmbHztTDRvgAVTySfTqq_7FxiORGjecUplV9ntxAo-spyJjnANL4XM1GNM_5PSa6oo3S6JMBe-LfH0Xy2z1dhmBLUxtdPmjeMLBMMJJ1vMrlYhZTljO0bxNoPIYNSLWENEl0QJdwdVbVD_xhBz3Ia2mgtLIQvViix3lKlTPPjcd-rcLLaqj7qJsJXY6SkT4b4sf_4J1lqxN4W7X9Urr2tvnvpToLSzGmEiWIzyOSr_fVCwckG3oOG_WUwt-NPD") : (agent?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCn-nUCpaWnqcC1zsXBZKXgOpcBbwKeZhKjUX2oqZJwYCW3O4USfRvD6y3IVqpSbe5f9v4PT8pskBwdUF5gBm_UBvUMm39dttBXmaJ5WdRngBp_R8x1pW5Rgz-XrJHXPP-fsng4eM5cU4WKnH5TAyAihfK6W1xv9IOuBmr5vT7Tx55vzc6y2rbzp1X-cz8ce5u6yuj3REisTDK4K8L3PtOoiIxO_7o2rBoQeGf6iSma1z_yZ02eRPxw-GoWK8KwICTDYGVpWuepaA22")} 
                className="w-full h-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-3 border-b border-slate-100 flex items-center gap-3">
                    <img 
                      alt="Profile Avatar" 
                      src={buyerLoggedIn ? (buyer?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAWOl1KhiIIsqVIjGMmbHztTDRvgAVTySfTqq_7FxiORGjecUplV9ntxAo-spyJjnANL4XM1GNM_5PSa6oo3S6JMBe-LfH0Xy2z1dhmBLUxtdPmjeMLBMMJJ1vMrlYhZTljO0bxNoPIYNSLWENEl0QJdwdVbVD_xhBz3Ia2mgtLIQvViix3lKlTPPjcd-rcLLaqj7qJsJXY6SkT4b4sf_4J1lqxN4W7X9Urr2tvnvpToLSzGmEiWIzyOSr_fVCwckG3oOG_WUwt-NPD") : (agent?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCn-nUCpaWnqcC1zsXBZKXgOpcBbwKeZhKjUX2oqZJwYCW3O4USfRvD6y3IVqpSbe5f9v4PT8pskBwdUF5gBm_UBvUMm39dttBXmaJ5WdRngBp_R8x1pW5Rgz-XrJHXPP-fsng4eM5cU4WKnH5TAyAihfK6W1xv9IOuBmr5vT7Tx55vzc6y2rbzp1X-cz8ce5u6yuj3REisTDK4K8L3PtOoiIxO_7o2rBoQeGf6iSma1z_yZ02eRPxw-GoWK8KwICTDYGVpWuepaA22")} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {buyerLoggedIn ? buyer?.name : agent?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono font-bold tracking-wide uppercase">
                        {buyerLoggedIn ? 'Portfolio Buyer' : 'Agency Broker'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {buyerLoggedIn ? buyer?.companyName : agent?.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="p-1.5 space-y-1">
                    <button 
                      onClick={() => {
                        setCurrentView(buyerLoggedIn ? 'buyer' : 'agent');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm text-slate-400">dashboard</span>
                      Go to Workspace
                    </button>
                    <button 
                      onClick={() => {
                        if (buyerLoggedIn) {
                          onLogoutBuyer();
                        } else {
                          onLogoutAgent();
                        }
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm text-rose-500">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="px-4 py-2 bg-gradient-to-r from-[#005bc4] to-[#0a2540] hover:opacity-90 text-white rounded-lg font-mono font-bold tracking-wide text-[11px] cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95 transition-all focus:outline-none"
            >
              <span className="material-symbols-outlined text-xs">login</span>
              PORTAL ACCESS
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100">
                    Secure Entrypoint
                  </div>
                  <div className="p-1 space-y-1">
                    <button 
                      onClick={() => {
                        setCurrentView('agent');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base text-[#005bc4]">badge</span>
                      Agent Portal
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentView('buyer');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base text-emerald-600">domain_verification</span>
                      Buyer Room
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
