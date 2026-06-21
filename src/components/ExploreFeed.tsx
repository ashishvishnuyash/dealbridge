import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InventoryItem } from '../types';

interface ExploreFeedProps {
  listings: InventoryItem[];
  recentListing: InventoryItem | null;
  onPostActivity: (title: string, desc: string, tag?: string) => void;
}

export default function ExploreFeed({ listings, recentListing, onPostActivity }: ExploreFeedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Commercial' | 'Retail' | 'Industrial' | 'Office'>('All');
  const [sortBy, setSortBy] = useState<'match' | 'valuation' | 'location'>('match');
  const [activeBidItem, setActiveBidItem] = useState<InventoryItem | null>(null);
  const [bidValue, setBidValue] = useState('$10,000,000');

  // Filter listings based on category tab & search terms
  const filtered = listings.filter(item => {
    const matchesTab = activeTab === 'All' || item.type.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.configuration.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'match') {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    if (sortBy === 'valuation') {
      return parseFloat(b.valuation.replace(/[^0-9.]/g, '')) - parseFloat(a.valuation.replace(/[^0-9.]/g, ''));
    }
    return a.location.localeCompare(b.location);
  });

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeBidItem) {
      onPostActivity(
        'Bid Submitted Successfully',
        `Marcus Thorne submitted an institutional bid of ${bidValue} for ${activeBidItem.title}`,
        'SUCCESS GREEN'
      );
      setActiveBidItem(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Intro block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">Audited Institutional Index</h2>
          <p className="text-sm text-slate-500 font-medium">Discover exclusive enterprise opportunities synced with live matching parameters.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono font-bold">
          <span className="material-symbols-outlined text-sm text-[#005bc4]">verified</span>
          <span>NET SECURITY LEVEL: SEVERE CRYP</span>
        </div>
      </div>

      {/* Filter and search controllers */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Tab buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(['All', 'Commercial', 'Retail', 'Industrial', 'Office'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-[#005bc4] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search bar LHS */}
        <div className="flex gap-2 w-full md:w-auto max-w-sm">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-sm">search</span>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by area, config..."
              className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded text-xs text-slate-900 outline-none focus:border-[#005bc4]"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 text-slate-800 p-2 rounded text-xs focus:border-[#005bc4] outline-none"
          >
            <option value="match">Match Score</option>
            <option value="valuation">Valuation High-to-Low</option>
            <option value="location">Location Alpha</option>
          </select>
        </div>
      </div>

      {/* Grid of properties card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(item => (
          <motion.div
            layoutId={item.id}
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#005bc4] transition-all flex flex-col justify-between group h-fit shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:shadow-md"
            whileHover={{ y: -4 }}
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                alt={item.title}
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-white/95 text-[#005bc4] border border-slate-200 font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm">
                {item.type.toUpperCase()}
              </span>
              <span className="absolute top-3 right-3 bg-emerald-600 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>offline_bolt</span>
                {item.matchScore}% Match
              </span>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-[#005bc4] transition-colors leading-tight">{item.title}</h3>
                <p className="text-slate-500 text-xs flex items-center gap-0.5 mt-1 font-medium">
                  <span className="material-symbols-outlined text-xs text-slate-400">location_on</span>
                  <span>{item.location}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] font-sans font-bold">VALUATION LIMIT</span>
                  <span className="font-mono text-[#005bc4] font-bold">{item.valuation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-sans font-bold">SIZE AREA</span>
                  <span className="font-mono text-slate-800 font-bold">{item.totalSize}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <span className="text-slate-400 block text-[9px] font-sans font-bold uppercase">Target Configuration</span>
                <p className="font-bold text-slate-800">{item.configuration}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Payment: <strong className="text-slate-700">{item.paymentMethod}</strong></span>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100 gap-2 flex">
              <button 
                onClick={() => {
                  setBidValue(item.valuation);
                  setActiveBidItem(item);
                }}
                className="w-full py-2.5 bg-[#0a2540] hover:bg-[#14365c] text-white font-semibold font-display text-xs rounded transition-all cursor-pointer text-center"
              >
                Initiate Bid Proposal
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl space-y-2">
          <span className="material-symbols-outlined text-slate-400 text-4xl">folder_off</span>
          <p className="text-slate-800 font-display font-medium text-lg">No Audited Listings Found</p>
          <p className="text-slate-500 text-xs">Try adjusting active category tabs or searching for different areas.</p>
        </div>
      )}

      {/* BID DIALOG OVERLAY */}
      <AnimatePresence>
        {activeBidItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 w-full max-w-md rounded-xl p-6 text-slate-900 space-y-6 shadow-xl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[#005bc4]">
                  <span className="material-symbols-outlined">gavel</span>
                  <h4 className="font-display font-bold text-slate-900">Initiate Bid Proposal</h4>
                </div>
                <button onClick={() => setActiveBidItem(null)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 cursor-pointer">close</button>
              </div>

              <div className="space-y-4 text-sm">
                <p className="text-slate-600 font-medium font-sans">Register an institutional interest for <span className="font-bold text-slate-800">{activeBidItem.title}</span> at {activeBidItem.location}.</p>
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-sans tracking-widest text-slate-500 font-bold mb-2">PROPOSAL VALUE SIZE</label>
                    <input
                      type="text"
                      required
                      value={bidValue}
                      onChange={(e) => setBidValue(e.target.value)}
                      placeholder="e.g. $10,000,000"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-slate-900 focus:border-[#005bc4] outline-none font-mono font-bold"
                    />
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-emerald-600">shield_lock</span>
                    <span>Action is authorized by blockchain ledger escrow and sent to verified brokers.</span>
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold font-display cursor-pointer transition-transform duration-200 active:scale-95">Verify & Transmit Bid</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
