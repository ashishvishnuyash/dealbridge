import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Buyer, BuyerRequirement, InventoryItem } from '../types';

interface BuyerPortalProps {
  buyer: Buyer;
  setBuyer: (buyer: Buyer) => void;
  workflow: string;
  setWorkflow: (flow: string) => void;
  onSubmitRequirement: (req: Partial<BuyerRequirement>) => void;
  listings: InventoryItem[];
  setCurrentView: (view: string) => void;
}

export default function BuyerPortal({
  buyer,
  setBuyer,
  workflow,
  setWorkflow,
  onSubmitRequirement,
  listings,
  setCurrentView
}: BuyerPortalProps) {
  // Login State
  const [buyerId, setBuyerId] = useState('BY-5098-TH');
  const [password, setPassword] = useState('password123');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Requirement Registration Stepper state
  const [fullName, setFullName] = useState('Marcus Thorne');
  const [email, setEmail] = useState('m.thorne@thornecapital.com');
  const [phone, setPhone] = useState('+1 (555) 987-6543');
  const [org, setOrg] = useState('Thorne Capital Partners');
  const [portfolioSize, setPortfolioSize] = useState('$25M - $100M');
  const [primaryClass, setPrimaryClass] = useState('Commercial');
  const [targetLocation, setTargetLocation] = useState('Mayfair District, London');
  const [minBudget, setMinBudget] = useState('$5M');
  const [maxBudget, setMaxBudget] = useState('$10M');
  const [sizeReq, setSizeReq] = useState('15,000 - 25,000 SQ FT');
  const [purpose, setPurpose] = useState<'Investment' | 'Owner-Occupied'>('Investment');
  const [society, setSociety] = useState('Mayfair Commercial Plaza');
  const [payment, setPayment] = useState('Escrow / Smart Contract');

  // Selected matching item for modal detail
  const [selectedAsset, setSelectedAsset] = useState<InventoryItem | null>(null);
  const [bidSuccessMessage, setBidSuccessMessage] = useState<string | null>(null);

  // Simulated algorithm to calculate matching score in real-time
  const getMatchScore = (listing: InventoryItem): number => {
    let base = 75;
    const locL = listing.location.toLowerCase();
    const locR = targetLocation.toLowerCase();
    if (locL.includes(locR) || locR.includes(locL)) base += 15;
    if (listing.paymentMethod === payment) base += 5;
    return Math.min(base, 99);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setBuyer(data);
      setWorkflow('dashboard');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          companyName: org,
          mobileNo: phone,
          emailId: email,
          reraNo: '#RERA-8832-TX-2024',
          portfolioSize,
          primaryAssetClass: primaryClass,
          password: 'password123'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setBuyer(data);
      onSubmitRequirement({
        targetLocation,
        sizeRequired: sizeReq,
        configuration: 'Grade A Office Space',
        minBudget,
        maxBudget,
        paymentMethod: payment,
        purpose,
        societyName: society
      });
      setWorkflow('dashboard');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Registration failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        
        {/* BUYER PORTAL ACCESS LOGIN */}
        {workflow === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center pt-8 pb-16"
          >
            <div className="w-full max-w-[440px] space-y-6">
              <div className="text-center font-display space-y-2">
                <span className="material-symbols-outlined text-[36px] text-[#005bc4]">shield</span>
                <h1 className="text-3xl font-extrabold text-slate-900">Buyer Room Access</h1>
                <p className="text-slate-500 text-sm font-medium">Welcome back. Please authorize key parameters to search inventory.</p>
              </div>

              {/* Login card container */}
              <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-md relative backdrop-blur-sm">
                {authError && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded text-xs font-semibold border border-rose-100 mb-2">
                    {authError}
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Buyer ID */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500" htmlFor="buyer-id">Buyer ID</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">person</span>
                      </span>
                      <input 
                        required
                        type="text" 
                        id="buyer-id"
                        value={buyerId}
                        onChange={(e) => setBuyerId(e.target.value)}
                        placeholder="e.g. BY-5098-TH"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#005bc4] rounded text-slate-900 text-sm outline-none transition-all font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500" htmlFor="buyer-password">Password</label>
                      <button type="button" className="text-xs text-[#005bc4] hover:underline cursor-pointer font-bold">Forgot Parameters?</button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">lock</span>
                      </span>
                      <input 
                        required
                        type={showPassword ? 'text' : 'password'} 
                        id="buyer-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-[#005bc4] rounded text-slate-900 text-sm outline-none transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 outline-none"
                      >
                        <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isAuthenticating}
                    className="w-full py-3.5 bg-[#0a2540] hover:bg-[#14365c] text-white rounded font-bold font-display text-xs cursor-pointer tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <span>{isAuthenticating ? 'Authorizing secure node...' : 'Authorize & Join Room'}</span>
                    <span className="material-symbols-outlined text-sm font-bold">login</span>
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    New enterprise buyer registry?{' '}
                    <button onClick={() => setWorkflow('requirement')} className="text-[#005bc4] font-bold hover:underline cursor-pointer">
                      Submit Buyer Requirements
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEPPER REGISTERING REQUIREMENTS WORKFLOW */}
        {workflow === 'requirement' && (
          <motion.div 
            key="requirement"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center pt-4 pb-16"
          >
            <div className="w-full max-w-[560px] space-y-6">
              <div className="text-center font-display space-y-2">
                <span className="material-symbols-outlined text-[36px] text-emerald-600">playlist_add_check</span>
                <h1 className="text-3xl font-extrabold text-slate-900">Buyer Room Placement</h1>
                <p className="text-slate-500 text-sm font-medium">Declare your corporate purchase parameters to execute live ledger matches.</p>
              </div>

              {/* Requirement Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-md">
                {authError && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded text-xs font-semibold border border-rose-100 mb-2">
                    {authError}
                  </div>
                )}
                <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                  
                  {/* General Contact Info Block */}
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">1. Institutional Entity</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Contact Person Name</label>
                      <input 
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Corporate Agency / Fund</label>
                      <input 
                        required
                        type="text"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Business Registry Email</label>
                      <input 
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Verified Contact No</label>
                      <input 
                        required
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                  </div>

                  {/* Requirements Parameters Block */}
                  <div className="border-b border-slate-100 pt-2 pb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">2. Purchase Protocol Matching Parameters</span>
                  </div>

                  {/* Class and size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Primary Asset Class</label>
                      <select 
                        value={primaryClass}
                        onChange={(e) => setPrimaryClass(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded outline-none focus:border-[#005bc4] font-medium"
                      >
                        <option value="Commercial">Commercial (Multipurpose)</option>
                        <option value="Office">Office PLaza</option>
                        <option value="Retail">Retail (Direct)</option>
                        <option value="Industrial">Industrial (Sovereign)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Target Location / Region</label>
                      <input 
                        required
                        type="text"
                        value={targetLocation}
                        onChange={(e) => setTargetLocation(e.target.value)}
                        placeholder="e.g. Mayfair District, London"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                  </div>

                  {/* Budget Ranges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Minimum Budget Value</label>
                      <input 
                        required
                        type="text"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Maximum Budget Value</label>
                      <input 
                        required
                        type="text"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium font-mono"
                      />
                    </div>
                  </div>

                  {/* Size and Purpose */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500 font-bold">Total Space Required</label>
                      <input 
                        required
                        type="text"
                        value={sizeReq}
                        onChange={(e) => setSizeReq(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500 font-bold">Acquisition Intent Purpose</label>
                      <select 
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value as any)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded outline-none focus:border-[#005bc4] font-medium"
                      >
                        <option value="Investment">Core Investment Overlap</option>
                        <option value="Owner-Occupied">Owner-Occupied Headquarters</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold font-display text-xs cursor-pointer tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Commit Requirements & Match</span>
                    <span className="material-symbols-outlined text-sm font-bold">sync_alt</span>
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <p className="text-xs text-slate-500">
                    Already registered partner?{' '}
                    <button onClick={() => setWorkflow('login')} className="text-[#005bc4] font-bold hover:underline cursor-pointer">
                      Sign In Access Key
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOGGED IN BUYER DASHBOARD */}
        {workflow === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 animate-fade-in"
          >
            {/* Buyer Portfolio Banner Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                  <img src={buyer.avatarUrl} alt={buyer.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                    <span>{buyer.name}</span>
                    <span className="inline-flex items-center text-[9px] font-mono font-bold bg-[#005bc4]/5 text-[#005bc4] border border-[#005bc4]/20 px-2.5 py-0.5 rounded uppercase">ACCREDITED FUND</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium font-sans uppercase tracking-widest">{buyer.companyName}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Asset Class Limit: {buyer.primaryAssetClass} | size cap: {buyer.portfolioSize}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setWorkflow('requirement')}
                  className="px-5 py-2.5 bg-[#005bc4] hover:bg-[#004bb3] text-white font-semibold flex items-center gap-1.5 rounded transition-all cursor-pointer text-xs"
                >
                  <span className="material-symbols-outlined text-sm">settings_suggest</span>
                  <span>Revise Match Criteria</span>
                </button>
                <button 
                  onClick={() => {
                    setBuyer({} as any);
                    setWorkflow('login');
                  }}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded transition-all cursor-pointer text-xs"
                >
                  Sign Out Room
                </button>
              </div>
            </div>

            {/* Dashboard Contents Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Dynamic Matching listings portfolio */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-slate-900 text-lg">Real-Time Sovereign Matches</h3>
                  <span className="text-[10px] font-mono tracking-wider font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">MATCHING RATIO HIGH</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listings.map(item => {
                    const matchScore = getMatchScore(item);
                    return (
                      <div 
                        key={item.id}
                        className="bg-slate-50/50 border border-slate-200/80 rounded-xl overflow-hidden hover:border-[#005bc4] transition-all flex flex-col justify-between group h-[360px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md"
                      >
                        <div className="relative h-40 bg-slate-100 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <span className="absolute top-2.5 left-2.5 bg-white/95 text-[#005bc4] text-[9px] font-bold font-mono tracking-widest border border-slate-200 py-1 px-2.5 rounded shadow-sm">{item.type.toUpperCase()}</span>
                          <span className="absolute top-2.5 right-2.5 bg-emerald-600 font-mono font-bold text-[10px] text-white py-1 px-2.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[10px]">bolt</span>
                            {matchScore}% Overlap
                          </span>
                        </div>

                        <div className="p-4 space-y-3 flex-grow font-sans">
                          <div>
                            <h4 className="font-bold text-slate-900 font-display group-hover:text-[#005bc4] transition-colors line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 font-medium flex items-center mt-0.5">
                              <span className="material-symbols-outlined text-xs mr-0.5">location_on</span>{item.location}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 border-y border-slate-100 py-2.5 text-[11px] font-sans">
                            <div>
                              <span className="text-slate-400 block text-[9px] font-bold">VALUATION LIMIT</span>
                              <span className="font-mono text-[#005bc4] font-bold">{item.valuation}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] font-bold">SIZE AREA</span>
                              <span className="font-mono text-slate-800 font-bold">{item.totalSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex gap-2">
                          <button 
                            onClick={() => setSelectedAsset(item)}
                            className="w-full py-2 bg-[#0a2540] hover:bg-[#14365c] text-white font-semibold font-display text-[11px] rounded transition-all cursor-pointer text-center"
                          >
                            Analyze Matching Parameters
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Buyer registry specs */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm text-xs font-sans">
                <h3 className="font-display font-bold text-slate-900 border-b border-slide-100 pb-2 text-sm">Active Buyer Profile Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase font-mono">Location Target</span>
                    <p className="text-slate-800 font-bold text-sm mt-0.5 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-[#005bc4]">location_on</span>
                      {targetLocation}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase font-mono">Budget Boundaries</span>
                    <p className="text-slate-800 font-mono font-bold mt-0.5 text-sm">{minBudget} - {maxBudget}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase font-mono font-mono">Escrow Payment Gateway</span>
                    <p className="text-slate-800 font-semibold mt-0.5">{payment}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg text-[10px] text-slate-500 font-medium space-y-1.5 leading-normal">
                    <p className="font-bold text-slate-700">ESCROW ESCORT ASSURED</p>
                    <p>All bids deployed within Buyer room are digitally encrypted and verified via escrow ledger protocols instantly.</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* DETAIL MODAL FOR SELETED MATCHING PROTOCOL */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 w-full max-w-lg rounded-xl overflow-hidden text-slate-900 shadow-xl"
            >
              {/* Image banner */}
              <div className="relative h-56 bg-slate-100">
                <img src={selectedAsset.image} alt={selectedAsset.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setSelectedAsset(null); setBidSuccessMessage(null); }}
                  className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full text-slate-800 hover:text-slate-950 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-[#005bc4] text-white text-[9px] font-bold font-mono tracking-widest px-2.5 py-1 rounded shadow">{selectedAsset.type.toUpperCase()}</span>
                  <span className="bg-emerald-600 text-white text-[9px] font-bold font-mono px-2.5 py-1 rounded shadow">{getMatchScore(selectedAsset)}% Perfect Overlap</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-bold font-display text-slate-900 tracking-tight leading-tight">{selectedAsset.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center">
                    <span className="material-symbols-outlined text-xs text-[#005bc4] mr-0.5">location_on</span>
                    {selectedAsset.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Target Valuation limit</span>
                    <span className="font-mono text-[#005bc4] text-sm font-bold">{selectedAsset.valuation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Built Up Area Size</span>
                    <span className="font-mono text-slate-900 text-sm font-bold">{selectedAsset.totalSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Configuration details</span>
                    <span className="text-slate-800 font-bold">{selectedAsset.configuration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">escrow payment gateway</span>
                    <span className="text-slate-800 font-bold">{selectedAsset.paymentMethod}</span>
                  </div>
                </div>

                {bidSuccessMessage ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600">verified_user</span>
                    <div className="text-xs">
                      <p className="font-bold">Transmission Sent</p>
                      <p className="mt-0.5">{bidSuccessMessage}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setBidSuccessMessage(`Escrow bidding initiated for ${selectedAsset.title} valued at ${selectedAsset.valuation}`);
                        setTimeout(() => {
                          setBidSuccessMessage(null);
                          setSelectedAsset(null);
                        }, 2500);
                      }}
                      className="flex-1 py-3 bg-[#0a2540] hover:bg-[#14365c] text-white rounded font-bold font-display text-xs cursor-pointer text-center shadow-lg uppercase tracking-wide transition-all"
                    >
                      Transmit Bid Proposal
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedAsset(null);
                        setBidSuccessMessage(null);
                      }}
                      className="py-3 px-6 border border-slate-200 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded font-semibold text-xs cursor-pointer text-center"
                    >
                      Close Parameters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
