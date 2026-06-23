import React from 'react';
import { LogActivity } from '../types';

interface DashboardStatsProps {
  activities: LogActivity[];
  onClearActivities: () => void;
  listingsCount: number;
}

export default function DashboardStats({ activities, onClearActivities, listingsCount }: DashboardStatsProps) {
  // Cities matching index bars
  const matchPerformance = [
    { city: 'London Mayfair', score: 98, color: '#005bc4' },
    { city: 'Jurong Singapore', score: 92, color: '#10b981' },
    { city: 'Orchard Gateway', score: 85, color: '#0284c7' },
    { city: 'Wall Street NY', score: 78, color: '#475569' },
    { city: 'Dubai Marina', score: 64, color: '#64748b' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Intro */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">System Analytics & Logs</h2>
        <p className="text-sm text-slate-500 font-medium">Continuous telemetry of matching overlap protocols and sovereign assets.</p>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-xl space-y-2 shadow-sm">
          <span className="text-[10px] uppercase font-sans tracking-widest text-[#005bc4] font-bold">Total Active Inventory</span>
          <p className="text-4xl font-extrabold text-slate-900 font-mono">{listingsCount} Assets</p>
          <p className="text-xs text-slate-500 font-medium">Indexed from verified agencies.</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-xl space-y-2 shadow-sm">
          <span className="text-[10px] uppercase font-sans tracking-widest text-[#10b981] font-bold">Match Overlap Efficiency</span>
          <p className="text-4xl font-extrabold text-slate-900 font-mono">98.4%</p>
          <p className="text-xs text-slate-500 font-medium font-sans">Target score on Mayfair District.</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-xl space-y-2 shadow-sm">
          <span className="text-[10px] uppercase font-sans tracking-widest text-slate-500 font-bold">Closing Sentiment</span>
          <p className="text-4xl font-extrabold text-emerald-600 font-mono">BULLISH</p>
          <p className="text-xs text-slate-500 font-medium font-sans">Audited ledger sentiment score.</p>
        </div>
      </div>

      {/* Bar Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Deal closing overlap graph */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900">Deal Closing Overlap Index</h3>
            <span className="text-xs font-mono font-bold text-[#005bc4] uppercase">City Level Scores</span>
          </div>

          <div className="space-y-4 font-sans">
            {matchPerformance.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>{item.city}</span>
                  <span className="font-mono font-bold" style={{ color: item.color }}>{item.score}% Overlap</span>
                </div>
                <div className="w-full bg-slate-50 h-4 rounded-lg overflow-hidden border border-slate-200">
                  <div 
                    className="h-full rounded-lg transition-all duration-1000"
                    style={{ 
                      width: `${item.score}%`, 
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live system activities logger */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between h-[360px] shadow-sm">
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-display font-bold text-sm text-slate-900">Security Ledger Logs</h3>
              <button 
                onClick={onClearActivities}
                className="text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                Clear Ledger
              </button>
            </div>

            {/* Scrollable logs */}
            <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar text-xs">
              {activities.map((act) => (
                <div key={act.id} className="border-l-2 pl-3 py-1 space-y-1" style={{ borderColor: act.color === 'green' ? '#10b981' : act.color === 'blue' ? '#005bc4' : '#64748b' }}>
                  <div className="flex justify-between text-[10px]">
                    <span className="font-mono font-bold uppercase" style={{ color: act.color === 'green' ? '#10b981' : act.color === 'blue' ? '#005bc4' : '#64748b' }}>{act.tag}</span>
                    <span className="text-slate-400 font-mono tracking-tighter">{act.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-tight">{act.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-normal font-sans font-medium">{act.description}</p>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <span className="material-symbols-outlined text-4xl text-slate-300 block mb-1">database_off</span>
                  <span className="font-sans font-medium text-xs">Telemetry logs empty. No active queries.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hostinger PHP Export Banner */}
      <section className="bg-gradient-to-r from-[#0a2540] to-[#042012] border border-slate-200 p-8 rounded-xl items-center flex flex-col md:flex-row justify-between gap-6 shadow-md text-white">
        <div className="space-y-3 max-w-xl text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-white rounded font-mono text-[9px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Hostinger Custom Deployment Package
          </span>
          <h3 className="text-2xl font-bold font-display text-white tracking-tight leading-tight">Need to deploy this system on custom HTML/PHP hosting?</h3>
          <p className="text-xs text-slate-200 leading-normal font-sans font-medium">
            We compiled a beautiful, self-contained single-page dynamic PHP application (`deal_bridge.php`) that runs out-of-the-box in standard shared PHP folders. This incorporates complete responsive Tailwind UI views, matching scoring logic, and session-based state management!
          </p>
        </div>
        <a 
          href="/api/export-php"
          download="deal_bridge.php"
          className="px-8 py-4 bg-emerald-500 text-slate-950 rounded-lg font-display font-semibold hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-sm font-semibold">cloud_download</span>
          <span>Download Hostinger PHP</span>
        </a>
      </section>
    </div>
  );
}
