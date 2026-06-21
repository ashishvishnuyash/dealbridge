import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AgentPortal from './components/AgentPortal';
import BuyerPortal from './components/BuyerPortal';
import ExploreFeed from './components/ExploreFeed';
import DashboardStats from './components/DashboardStats';
import { InventoryItem, BuyerRequirement, LogActivity, Agent, Buyer } from './types';
import { INITIAL_LISTINGS, INITIAL_REQUIREMENTS, INITIAL_ACTIVITIES } from './data';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [agentWorkflow, setAgentWorkflow] = useState<string>('login');
  const [buyerWorkflow, setBuyerWorkflow] = useState<string>('login');

  // Core Synced Datastores
  const [listings, setListings] = useState<InventoryItem[]>([]);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [activities, setActivities] = useState<LogActivity[]>([]);

  // Authenticated State Context
  const [agent, setAgent] = useState<Agent>({
    id: 'AGT-4492-BX',
    name: 'Alexander Sterling',
    companyName: 'Sterling Global Realty',
    mobileNo: '+1 (555) 012-3456',
    emailId: 'a.sterling@dealbridge.com',
    reraNo: '#RERA-8832-TX-2024',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn-nUCpaWnqcC1zsXBZKXgOpcBbwKeZhKjUX2oqZJwYCW3O4USfRvD6y3IVqpSbe5f9v4PT8pskBwdUF5gBm_UBvUMm39dttBXmaJ5WdRngBp_R8x1pW5Rgz-XrJHXPP-fsng4eM5cU4WKnH5TAyAihfK6W1xv9IOuBmr5vT7Tx55vzc6y2rbzp1X-cz8ce5u6yuj3REisTDK4K8L3PtOoiIxO_7o2rBoQeGf6iSma1z_yZ02eRPxw-GoWK8KwICTDYGVpWuepaA22'
  });
  const [buyer, setBuyer] = useState<Buyer>({
    id: 'BY-5098-TH',
    name: 'Marcus Thorne',
    companyName: 'Thorne Capital Partners',
    mobileNo: '+1 (555) 987-6543',
    emailId: 'm.thorne@thornecapital.com',
    reraNo: '#RERA-8832-TX-2024',
    portfolioSize: '$25M - $100M',
    primaryAssetClass: 'Commercial',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXu-t4tFILC86BV5-pups-w_Ab5jKF1wSyo2glfXkwvivWX-IkdzOSKym8yV9290ARGk9bhS6ks7vSyxIk7Afgcw1wuWXPCa9CyJaVtS2ja7TzqCu6ago22GY5sjqqx8dSTfPthQ16cw-tD8ZQiYFNVH2XDiTCaD9pac-2sIuC6Ss9pps_y7O281NnswK88-Rbqq1H6KJ23FpIRdA-pmRPYj8PHExB5M0mbhGc5ThKHMrJ8nvgXzIfcMsgsq0iEEqJUB_Fh8u9GRQEgz'
  });

  const [agentLoggedIn, setAgentLoggedIn] = useState(false);
  const [buyerLoggedIn, setBuyerLoggedIn] = useState(false);
  const [recentListing, setRecentListing] = useState<InventoryItem | null>(null);

  // Sync API States from Express
  const syncAll = async () => {
    try {
      // 1. Fetch Listings
      const listingsRes = await fetch('/api/listings');
      if (listingsRes.ok) {
        const listingsData = await listingsRes.json();
        setListings(listingsData);
      } else {
        setListings(INITIAL_LISTINGS);
      }

      // 2. Fetch Requirements
      const requirementsRes = await fetch('/api/requirements');
      if (requirementsRes.ok) {
        const reqData = await requirementsRes.json();
        setRequirements(reqData);
      } else {
        setRequirements(INITIAL_REQUIREMENTS);
      }

      // 3. Fetch Telemetry logs
      const activitiesRes = await fetch('/api/activities');
      if (activitiesRes.ok) {
        const actData = await activitiesRes.json();
        setActivities(actData);
      } else {
        setActivities(INITIAL_ACTIVITIES);
      }
    } catch (e) {
      // Fallback to local memory state on client-only mode
      console.warn('API route communication inactive, utilizing system memory caches:', e);
      setListings(INITIAL_LISTINGS);
      setRequirements(INITIAL_REQUIREMENTS);
      setActivities(INITIAL_ACTIVITIES);
    }
  };

  useEffect(() => {
    syncAll();
  }, [currentView]);

  // Synchronized Event: Agent posts a listing
  const handlePostListing = async (newListingItem: Partial<InventoryItem>) => {
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListingItem)
      });
      if (response.ok) {
        const created = await response.json();
        setRecentListing(created);
        syncAll();
      } else {
        // Local state fallback
        const mockCreated = {
          ...newListingItem,
          id: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Active',
          tags: newListingItem.tags || ['Fiber Optic Ready', 'Executive Suite'],
          matchScore: 94
        } as InventoryItem;
        setRecentListing(mockCreated);
        setListings(prev => [mockCreated, ...prev]);
      }
    } catch {
      // Fallover
      const mockCreated = {
        ...newListingItem,
        id: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active',
        tags: newListingItem.tags || ['Fiber Optic Ready', 'Executive Suite'],
        matchScore: 94
      } as InventoryItem;
      setRecentListing(mockCreated);
      setListings(prev => [mockCreated, ...prev]);
    }
  };

  // Synchronized Event: Buyer posts requirements
  const handlePostRequirement = async (newReq: Partial<BuyerRequirement>) => {
    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      if (response.ok) {
        syncAll();
      } else {
        setRequirements(prev => [newReq as BuyerRequirement, ...prev]);
      }
    } catch {
      setRequirements(prev => [newReq as BuyerRequirement, ...prev]);
    }
  };

  // Synchronized Event: Post Activity telemetry log
  const handlePostActivity = async (title: string, desc: string, tag: string = 'BROKER') => {
    const actItemObj = {
      id: `ACT-${Date.now()}`,
      type: 'post',
      title,
      description: desc,
      timestamp: 'Just now',
      tag,
      color: tag.includes('GREEN') ? 'green' : 'blue'
    };
    setActivities(prev => [actItemObj, ...prev]);
  };

  // Clear system logs
  const handleClearActivities = async () => {
    try {
      await fetch('/api/activities/clear', { method: 'POST' });
    } catch {}
    setActivities([]);
  };

  // Handle agent user session sign-ins
  const handleAgentSignInChange = (newAgent: Agent) => {
    setAgent(newAgent);
    setAgentLoggedIn(true);
  };

  // Handle buyer user session sign-ins
  const handleBuyerSignInChange = (newBuyer: Buyer) => {
    setBuyer(newBuyer);
    setBuyerLoggedIn(true);
  };

  return (
    <div className="bg-transparent text-slate-900 min-h-screen flex flex-col justify-between font-sans">
      
      {/* Exquisite global header */}
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        agentLoggedIn={agentLoggedIn}
        buyerLoggedIn={buyerLoggedIn}
      />

      {/* Main content body */}
      <main className="flex-grow pt-24 pb-12 w-full max-w-7xl mx-auto px-6">
        
        {currentView === 'landing' && (
          <LandingPage 
            setCurrentView={setCurrentView}
            setAgentWorkflow={setAgentWorkflow}
            setBuyerWorkflow={setBuyerWorkflow}
          />
        )}

        {currentView === 'agent' && (
          <AgentPortal 
            agent={agent}
            setAgent={handleAgentSignInChange}
            workflow={agentWorkflow}
            setWorkflow={setAgentWorkflow}
            onPostListing={handlePostListing}
            recentListing={recentListing}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'buyer' && (
          <BuyerPortal 
            buyer={buyer}
            setBuyer={handleBuyerSignInChange}
            workflow={buyerWorkflow}
            setWorkflow={setBuyerWorkflow}
            onSubmitRequirement={handlePostRequirement}
            listings={listings}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'explore' && (
          <ExploreFeed 
            listings={listings}
            recentListing={recentListing}
            onPostActivity={handlePostActivity}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardStats 
            activities={activities}
            onClearActivities={handleClearActivities}
            listingsCount={listings.length}
          />
        )}

      </main>

      {/* Global modern footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-display font-medium text-slate-900 text-sm">Deal Bridge Exchange Network</p>
            <p>&copy; 2426 Deal Bridge. Secure Institutional Real Estate Ledger. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" onClick={() => setCurrentView('landing')} className="hover:text-slate-950 transition-colors">Support Center</a>
            <a href="#" className="hover:text-slate-950 transition-colors">Audit Node Registry</a>
            <a href="#" onClick={() => setCurrentView('dashboard')} className="hover:text-emerald-600 transition-colors font-mono font-bold">SYSTEM UPTIME: 100%</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
