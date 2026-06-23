import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Agent, InventoryItem } from '../types';

interface AgentPortalProps {
  agent: Agent;
  setAgent: (agent: Agent) => void;
  workflow: string;
  setWorkflow: (flow: string) => void;
  onPostListing: (item: Partial<InventoryItem>) => void;
  recentListing: InventoryItem | null;
  setCurrentView: (view: string) => void;
}

export default function AgentPortal({
  agent,
  setAgent,
  workflow,
  setWorkflow,
  onPostListing,
  recentListing,
  setCurrentView
}: AgentPortalProps) {
  // Login Form states
  const [agentId, setAgentId] = useState('AGT-4492-BX');
  const [password, setPassword] = useState('password123');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Partnership form states
  const [fullName, setFullname] = useState('Jonathan Doe');
  const [email, setEmail] = useState('jonathan@firm.com');
  const [phone, setPhone] = useState('50 123 4567');
  const [phonePrefix, setPhonePrefix] = useState('+971');
  const [company, setCompany] = useState('Nexus Realty Systems');
  const [gstin, setGstin] = useState('12345-AB');
  const [exp, setExp] = useState('7-15 Years');
  const [uploadedAadhar, setUploadedAadhar] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedProfile] = useState<string | null>(null);

  // Posting Input Form states
  const [postTitle, setPostTitle] = useState('Skyline Loft');
  const [postType, setPostType] = useState<'Commercial' | 'Retail' | 'Industrial' | 'Multi-Family' | 'Office' | 'Mixed-Use'>('Commercial');
  const [postLocation, setPostLocation] = useState('Mayfair District, London');
  const [postBudget, setPostBudget] = useState('$5M - $10M');
  const [postConfig, setPostConfig] = useState('Grade A Office Space');
  const [postSize, setPostSize] = useState('18,500 SQ FT');
  const [postPayment, setPostPayment] = useState('Escrow / Smart Contract');
  const [postValuation, setPostValuation] = useState('$12,500,000');

  // Handle real Authentication Login API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setAgent(data);
      setWorkflow('dashboard');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle real Partnership Stepper submit
  const handlePartnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          companyName: company,
          mobileNo: `${phonePrefix} ${phone}`,
          emailId: email,
          reraNo: `#RERA-${gstin}`,
          avatarUrl: uploadedPhoto || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn-nUCpaWnqcC1zsXBZKXgOpcBbwKeZhKjUX2oqZJwYCW3O4USfRvD6y3IVqpSbe5f9v4PT8pskBwdUF5gBm_UBvUMm39dttBXmaJ5WdRngBp_R8x1pW5Rgz-XrJHXPP-fsng4eM5cU4WKnH5TAyAihfK6W1xv9IOuBmr5vT7Tx55vzc6y2rbzp1X-cz8ce5u6yuj3REisTDK4K8L3PtOoiIxO_7o2rBoQeGf6iSma1z_yZ02eRPxw-GoWK8KwICTDYGVpWuepaA22',
          password: 'password123'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setAgent(data);
      setWorkflow('dashboard');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Registration failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Post dynamic Listing handler
  const handlePostingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPostListing({
      title: postTitle,
      type: postType === 'Commercial' ? 'Commercial' : 'Office',
      location: postLocation,
      budgetRange: postBudget,
      configuration: postConfig,
      totalSize: postSize,
      paymentMethod: postPayment,
      valuation: postValuation,
      purpose: 'Sale',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-w0Q4gbbfbS_oqD5MwWEz1Nfouy05SO44KEEYH65MiijkU33SOxEe_KlP4DioGpSL55mESrArWNM-bfLd6qSDkY2CbwfHLqiyaHkHhowgngBKxNTbGFybj5AhQj6PzfkXu5zyJIVIMM-8ZLU1U59_2MOJHXAARhCf2-yAq013ntXKH7k_QstSWQXHxtlaAMuKh7gRqf9rFVSkN7jPri3N9FjyScT8heAM9gBGfvRK2-A0fNThHOGKRp5TaYiA8xIQa4DnOawkBlWL',
      tags: ['Fiber Optic Ready', 'LEED Certified', '24/7 Security', 'Executive Lounge']
    });
    setWorkflow('success');
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        
        {/* LOGIN WORKFLOW */}
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
                <span className="material-symbols-outlined text-[36px] text-[#005bc4]">real_estate_agent</span>
                <h1 className="text-3xl font-extrabold text-slate-900">Agent Portal Access</h1>
                <p className="text-slate-500 text-sm font-medium">Welcome back. Please authorize with security keys to synch ledger.</p>
              </div>

              {/* Login Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-md relative backdrop-blur-sm">
                {authError && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded text-xs font-semibold border border-rose-100 mb-2">
                    {authError}
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Agent ID */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500" htmlFor="agent-id">Agent ID</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">badge</span>
                      </span>
                      <input 
                        required
                        type="text" 
                        id="agent-id"
                        value={agentId}
                        onChange={(e) => setAgentId(e.target.value)}
                        placeholder="e.g. AGT-4492-BX"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#005bc4] rounded text-slate-900 text-sm outline-none transition-all font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500" htmlFor="password">Password</label>
                      <button type="button" className="text-xs text-[#005bc4] hover:underline cursor-pointer font-bold">Forgot Parameter?</button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">lock</span>
                      </span>
                      <input 
                        required
                        type={showPassword ? 'text' : 'password'} 
                        id="password"
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
                    <span>{isAuthenticating ? 'Decrypting Secure Node...' : 'Authenticate & Sign In'}</span>
                    <span className="material-symbols-outlined text-sm font-bold">login</span>
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    New to Zsetu Platform?{' '}
                    <button onClick={() => setWorkflow('register')} className="text-[#005bc4] font-bold hover:underline cursor-pointer">
                      Submit Partner Registry
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* REGESTER WORKFLOW (PARTNERSHIP APPLICATION) */}
        {workflow === 'register' && (
          <motion.div 
            key="register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center pt-8 pb-16"
          >
            <div className="w-full max-w-[560px] space-y-6">
              <div className="text-center font-display space-y-2">
                <span className="material-symbols-outlined text-[36px] text-emerald-600">how_to_reg</span>
                <h1 className="text-3xl font-extrabold text-slate-900">Partner Broker Application</h1>
                <p className="text-slate-500 text-sm font-medium">Provide real audited identifiers to initiate dynamic matchmaking clearance.</p>
              </div>

              {/* Form card */}
              <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-md">
                {authError && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded text-xs font-semibold border border-rose-100 mb-2">
                    {authError}
                  </div>
                )}
                <form onSubmit={handlePartnershipSubmit} className="space-y-5 text-sm md:text-xs">
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Contact Person Name</label>
                    <input 
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="e.g. Jonathan Doe"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                    />
                  </div>

                  {/* Contact Info (Row) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Corporate Email</label>
                      <input 
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@firm.com"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Contact Number</label>
                      <div className="flex gap-2">
                        <select 
                          value={phonePrefix}
                          onChange={(e) => setPhonePrefix(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-900 rounded px-2 outline-none"
                        >
                          <option value="+971">+971 (UAE)</option>
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                        </select>
                        <input 
                          required
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="50 123 4567"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company and GSTIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Agency Company Name</label>
                      <input 
                        required
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">RERA License / GSTIN</label>
                      <input 
                        required
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="RERA-12345-AB"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                  </div>

                  {/* Experience Select */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Total Transaction Experience</label>
                    <select 
                      value={exp}
                      onChange={(e) => setExp(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded outline-none focus:border-[#005bc4] font-medium"
                    >
                      <option value="1-3 Years">1-3 Years (Growth / Boutique)</option>
                      <option value="3-7 Years">3-7 Years (Established Regional)</option>
                      <option value="7-15 Years">7-15 Years (Enterprise Advisory)</option>
                      <option value="15+ Years">15+ Years (Global Institutional)</option>
                    </select>
                  </div>

                  {/* Verified File Upload Mocking */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Aadhar / Passport (PDF or IMG)</label>
                      <div className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded text-center text-xs relative hover:bg-slate-100 transition-colors">
                        <span className="material-symbols-outlined text-slate-400 block mb-1">upload_file</span>
                        {uploadedAadhar ? (
                          <span className="text-emerald-600 font-bold font-mono">FILE_READY.PDF ✓</span>
                        ) : (
                          <button 
                            type="button" 
                            onClick={() => setUploadedAadhar('aadhar_passport_doc.pdf')} 
                            className="text-[#005bc4] font-bold hover:underline cursor-pointer"
                          >
                            Upload Identity PDF
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Verified Photo Profile (JPG/PNG)</label>
                      <div className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded text-center text-xs relative hover:bg-slate-100 transition-colors">
                        <span className="material-symbols-outlined text-slate-400 block mb-1">photo_camera</span>
                        {uploadedPhoto ? (
                          <span className="text-emerald-600 font-bold font-mono">PHOTO_READY.PNG ✓</span>
                        ) : (
                          <button 
                            type="button" 
                            onClick={() => setUploadedProfile('https://lh3.googleusercontent.com/aida-public/AB6AXuAWOl1KhiIIsqVIjGMmbHztTDRvgAVTySfTqq_7FxiORGjecUplV9ntxAo-spyJjnANL4XM1GNM_5PSa6oo3S6JMBe-LfH0Xy2z1dhmBLUxtdPmjeMLBMMJJ1vMrlYhZTljO0bxNoPIYNSLWENEl0QJdwdVbVD_xhBz3Ia2mgtLIQvViix3lKlTPPjcd-rcLLaqj7qJsJXY6SkT4b4sf_4J1lqxN4W7X9Urr2tvnvpToLSzGmEiWIzyOSr_fVCwckG3oOG_WUwt-NPD')} 
                            className="text-[#005bc4] font-bold hover:underline cursor-pointer"
                          >
                            Upload Profile JPG
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold font-display text-xs cursor-pointer tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Submit Broker Proposal</span>
                    <span className="material-symbols-outlined text-sm font-bold">how_to_reg</span>
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

        {/* LOGGED IN DASHBOARD VIEW */}
        {workflow === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Agent profile card hero */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                  <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">{agent.name}</h2>
                  <p className="text-xs text-slate-500 font-medium font-sans uppercase tracking-widest">{agent.companyName}</p>
                  <p className="text-[11px] text-slate-400 font-mono tracking-tighter mt-0.5">{agent.reraNo} | EXP: 15+ Yrs</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setWorkflow('post-listing')}
                  className="px-5 py-2.5 bg-[#005bc4] hover:bg-[#004bb3] text-white font-semibold flex items-center gap-1.5 rounded transition-all cursor-pointer text-xs"
                >
                  <span className="material-symbols-outlined text-sm">add_box</span>
                  <span>Post Asset Inventory</span>
                </button>
                <button 
                  onClick={() => {
                    setAgent({} as any);
                    setWorkflow('login');
                  }}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded transition-all cursor-pointer text-xs"
                >
                  Sign Out Securely
                </button>
              </div>
            </div>

            {/* Dashboard grid panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Recent Active Postings list */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-slate-900 text-lg">Active Asset Portfolios</h3>
                  <span className="text-[10px] font-mono font-bold bg-[#005bc4]/5 text-[#005bc4] border border-[#005bc4]/20 px-2.5 py-1 rounded">BROKER OWNED</span>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-xl group hover:border-[#005bc4] transition-all">
                    <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden bg-slate-100">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-w0Q4gbbfbS_oqD5MwWEz1Nfouy05SO44KEEYH65MiijkU33SOxEe_KlP4DioGpSL55mESrArWNM-bfLd6qSDkY2CbwfHLqiyaHkHhowgngBKxNTbGFybj5AhQj6PzfkXu5zyJIVIMM-8ZLU1U59_2MOJHXAARhCf2-yAq013ntXKH7k_QstSWQXHxtlaAMuKh7gRqf9rFVSkN7jPri3N9FjyScT8heAM9gBGfvRK2-A0fNThHOGKRp5TaYiA8xIQa4DnOawkBlWL" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 font-display group-hover:text-[#005bc4] transition-all">London Mayfair HQ</h4>
                        <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">98% Match Overlap</span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center font-medium"><span className="material-symbols-outlined text-xs mr-0.5">location_on</span> Mayfair District, London</p>
                      <div className="flex gap-4 text-[10px] font-mono pt-2 text-slate-600">
                        <span>VALUATION: <strong>$14.5M</strong></span>
                        <span>SIZE: <strong>22,000 SQ FT</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic user posted item if any */}
                  {recentListing && (
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 border border-emerald-500/20 rounded-xl group hover:border-[#005bc4] transition-all">
                      <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden bg-slate-100">
                        <img src={recentListing.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 font-display group-hover:text-[#005bc4] transition-all">{recentListing.title}</h4>
                          <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">Syncing Ledger Match</span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center font-medium"><span className="material-symbols-outlined text-xs mr-0.5">location_on</span> {recentListing.location}</p>
                        <div className="flex gap-4 text-[10px] font-mono pt-2 text-slate-600">
                          <span>VALUATION: <strong>{recentListing.valuation}</strong></span>
                          <span>SIZE: <strong>{recentListing.totalSize}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Action shortcuts */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                <h3 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-2 text-sm">Ledger Status Nodes</h3>
                <div className="space-y-4 text-xs font-sans">
                  
                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 border border-slate-200 rounded-lg">
                    <span className="material-symbols-outlined text-emerald-600">dns</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">Ledger Bridge Node UAE-1</p>
                      <p className="text-slate-500 font-medium text-[10px]">Active & Calibrated (Sync score: 100%)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 border border-slate-200 rounded-lg">
                    <span className="material-symbols-outlined text-emerald-600">shield_check</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">Audited Brokers Smart Escrow</p>
                      <p className="text-slate-500 font-medium text-[10px]">Secure, SHA-256 Ledger Approved</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCurrentView('explore')}
                    className="w-full py-3 bg-[#0a2540] hover:bg-[#14365c] text-white rounded font-bold font-display uppercase tracking-wider text-[11px] cursor-pointer text-center"
                  >
                    View Global Market feed
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* POSTING ASSET VIEW */}
        {workflow === 'post-listing' && (
          <motion.div 
            key="post-listing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center pt-4 pb-16"
          >
            <div className="w-full max-w-[560px] space-y-6">
              <div className="text-center font-display space-y-2">
                <span className="material-symbols-outlined text-[36px] text-[#005bc4]">real_estate_agent</span>
                <h1 className="text-3xl font-extrabold text-slate-900">Post Asset Inventory</h1>
                <p className="text-slate-500 text-sm font-medium">Declare a shadow asset portfolio parameters to prompt dynamic investor matches.</p>
              </div>

              {/* Form Input Container */}
              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-md">
                <form onSubmit={handlePostingSubmit} className="space-y-5 text-sm md:text-xs">
                  
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Asset Display Title</label>
                    <input 
                      required
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="e.g. Skyline Grand Penthouse"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                    />
                  </div>

                  {/* Asset Category and Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Asset Category Type</label>
                      <select 
                        value={postType}
                        onChange={(e) => setPostType(e.target.value as any)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded outline-none focus:border-[#005bc4] font-medium"
                      >
                        <option value="Commercial">Commercial (Complex)</option>
                        <option value="Retail">Retail (Premium)</option>
                        <option value="Industrial">Industrial (Sovereign)</option>
                        <option value="Office">Office Plaza</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Asset Location / Region</label>
                      <input 
                        required
                        type="text"
                        value={postLocation}
                        onChange={(e) => setPostLocation(e.target.value)}
                        placeholder="e.g Mayfair, London"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                  </div>

                  {/* Valuation and Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Target Valuation Limit</label>
                      <input 
                        required
                        type="text"
                        value={postValuation}
                        onChange={(e) => setPostValuation(e.target.value)}
                        placeholder="e.g $15,000,000"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Total Built-Up Area Size</label>
                      <input 
                        required
                        type="text"
                        value={postSize}
                        onChange={(e) => setPostSize(e.target.value)}
                        placeholder="e.g 22,000 SQ FT"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                  </div>

                  {/* Configuration and Payment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Configuration Details</label>
                      <input 
                        required
                        type="text"
                        value={postConfig}
                        onChange={(e) => setPostConfig(e.target.value)}
                        placeholder="e.g. Commercial Grade A"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-sans font-bold tracking-widest text-slate-500">Escrow Payment Gateway</label>
                      <input 
                        required
                        type="text"
                        value={postPayment}
                        onChange={(e) => setPostPayment(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-[#005bc4] font-medium"
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setWorkflow('dashboard')}
                      className="w-full py-3.5 border border-slate-200 text-slate-600 hover:text-slate-900 rounded font-semibold transition-all cursor-pointer text-center text-xs"
                    >
                      Cancel Listing
                    </button>
                    <button 
                      type="submit" 
                      className="w-full py-3.5 bg-[#005bc4] hover:bg-[#004bb3] text-white rounded font-bold font-display cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm text-xs"
                    >
                      <span>Secure & Sync Listing</span>
                      <span className="material-symbols-outlined text-sm font-bold">cloud_sync</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* POST SUCCESS STATE SCREEN */}
        {workflow === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center pt-8 pb-16"
          >
            <div className="w-full max-w-[460px] text-center space-y-6 bg-white border border-slate-200 p-8 rounded-2xl shadow-md">
              <span className="material-symbols-outlined text-[64px] text-emerald-500 animate-bounce">check_circle</span>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900 font-display">Sovereign Asset Synced</h1>
                <p className="text-slate-500 text-xs font-medium font-sans">
                  The listing portfolio variables have been secure-hashed and committed to the Zsetu matching registry. Verification is active.
                </p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg text-left text-xs font-mono text-slate-600 space-y-2">
                <p className="font-bold border-b border-slate-200 pb-1 text-slate-700">HASH CORRESPONDENCE DECAL</p>
                <p className="truncate">TXN: 0x93FA..93E</p>
                <p>STATUS: SYSTEM DIRECT SCAN ENABLED</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setWorkflow('dashboard')}
                  className="w-full py-3 bg-[#0a2540] hover:bg-[#14365c] text-white rounded font-bold font-display text-xs cursor-pointer transition-all text-center"
                >
                  Return to Dashboard
                </button>
                <button 
                  onClick={() => setCurrentView('explore')}
                  className="w-full py-3 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded font-semibold text-xs cursor-pointer transition-all text-center"
                >
                  Check Market Feed
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
