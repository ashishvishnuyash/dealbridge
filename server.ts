import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_LISTINGS, INITIAL_REQUIREMENTS, INITIAL_ACTIVITIES } from './src/data.js';
import { InventoryItem, BuyerRequirement, LogActivity } from './src/types.js';
import { initDb, run, all, get } from './db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize SQLite database table schemas and seed them
  await initDb();

  // Helper: Calculate Match Score between listing and details
  function calculateScore(listing: InventoryItem, requirement: BuyerRequirement): number {
    let score = 75; // baseline match score
    
    // Exact location keyword alignment
    const locL = listing.location.toLowerCase();
    const locR = requirement.targetLocation.toLowerCase();
    if (locL.includes(locR) || locR.includes(locL)) {
      score += 15;
    } else if (locL.split(',')[0].includes(locR.split(',')[0])) {
      score += 10;
    }

    // Exact type matching e.g., Grade A Office, Commercial Commercial
    const typeL = listing.type.toLowerCase();
    const reqConf = requirement.configuration.toLowerCase();
    if (reqConf.includes(typeL) || typeL.includes(reqConf)) {
      score += 5;
    }

    // Payment alignment
    if (listing.paymentMethod.toLowerCase() === requirement.paymentMethod.toLowerCase()) {
      score += 5;
    }

    return Math.min(score, 99);
  }

  // API Endpoints
  app.get('/api/listings', async (req, res) => {
    try {
      const rows = await all<any>('SELECT * FROM listings ORDER BY rowid DESC');
      const listings = rows.map(r => ({
        ...r,
        tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags
      }));
      res.json(listings);
    } catch (err: any) {
      console.error("GET /api/listings error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/listings', async (req, res) => {
    try {
      const newListing: InventoryItem = {
        id: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
        title: req.body.title || 'Property Listing',
        type: req.body.type || 'Commercial',
        location: req.body.location || 'Unknown Location',
        budgetRange: req.body.budgetRange || '$5M - $10M',
        configuration: req.body.configuration || 'Shell & Core Office',
        totalSize: req.body.totalSize || '15,000 SQ FT',
        paymentMethod: req.body.paymentMethod || 'Escrow / Smart Contract',
        purpose: req.body.purpose || 'Sale',
        valuation: req.body.valuation || '$7.5M',
        yieldOpt: req.body.yieldOpt || 'Yield: 6.8%',
        status: 'Active',
        image: req.body.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
        tags: req.body.tags || ['Fiber Optic Ready', '24/7 Security'],
        description: req.body.description || 'Institutional listing published inside the Zsetu secure network.',
        matchScore: Math.floor(82 + Math.random() * 16)
      };

      await run(`
        INSERT INTO listings (id, title, type, location, budgetRange, configuration, totalSize, paymentMethod, purpose, valuation, yieldOpt, status, image, tags, description, matchScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newListing.id,
        newListing.title,
        newListing.type,
        newListing.location,
        newListing.budgetRange,
        newListing.configuration,
        newListing.totalSize,
        newListing.paymentMethod,
        newListing.purpose,
        newListing.valuation,
        newListing.yieldOpt,
        newListing.status,
        newListing.image,
        JSON.stringify(newListing.tags),
        newListing.description || null,
        newListing.matchScore || null
      ]);

      // Add activity log
      const act1 = {
        id: `ACT-${Date.now()}`,
        type: 'post',
        title: 'New Inventory Posting',
        description: `${newListing.title} added in ${newListing.location} (${newListing.totalSize})`,
        timestamp: 'Just now',
        tag: 'AGENT BLUE',
        color: 'blue'
      };
      await run(`
        INSERT INTO activities (id, type, title, description, timestamp, tag, color)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [act1.id, act1.type, act1.title, act1.description, act1.timestamp, act1.tag, act1.color]);

      // Check if it matches existing requirements and log
      const dbReqs = await all<BuyerRequirement>('SELECT * FROM requirements');
      for (const reqObj of dbReqs) {
        const matchScore = calculateScore(newListing, reqObj);
        if (matchScore > 80) {
          const actM = {
            id: `ACT-M-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: 'match',
            title: 'New Match Found',
            description: `${newListing.title} matches Requirement #${reqObj.id} (${matchScore}% Match Score)`,
            timestamp: 'Just now',
            tag: 'SUCCESS GREEN',
            color: 'green'
          };
          await run(`
            INSERT INTO activities (id, type, title, description, timestamp, tag, color)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [actM.id, actM.type, actM.title, actM.description, actM.timestamp, actM.tag, actM.color]);
        }
      }

      res.status(201).json(newListing);
    } catch (err: any) {
      console.error("POST /api/listings error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/requirements', async (req, res) => {
    try {
      const requirements = await all<BuyerRequirement>('SELECT * FROM requirements ORDER BY rowid DESC');
      res.json(requirements);
    } catch (err: any) {
      console.error("GET /api/requirements error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/requirements', async (req, res) => {
    try {
      const newReq: BuyerRequirement = {
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        buyerId: req.body.buyerId || 'BY-5098-TH',
        targetLocation: req.body.targetLocation || 'Mayfair District, London',
        sizeRequired: req.body.sizeRequired || '15,000 - 25,000 SQ FT',
        societyName: req.body.societyName || 'Prime Block',
        configuration: req.body.configuration || 'Grade A Office Space',
        minBudget: req.body.minBudget || '$5M',
        maxBudget: req.body.maxBudget || '$10M',
        paymentMethod: req.body.paymentMethod || 'Escrow / Smart Contract',
        purpose: req.body.purpose || 'Investment'
      };

      await run(`
        INSERT INTO requirements (id, buyerId, targetLocation, sizeRequired, societyName, configuration, minBudget, maxBudget, paymentMethod, purpose)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newReq.id,
        newReq.buyerId,
        newReq.targetLocation,
        newReq.sizeRequired,
        newReq.societyName || null,
        newReq.configuration,
        newReq.minBudget,
        newReq.maxBudget,
        newReq.paymentMethod,
        newReq.purpose
      ]);

      // Add Activity
      const actReq = {
        id: `ACT-${Date.now()}`,
        type: 'post',
        title: 'New Buyer Requirement',
        description: `Requirement #${newReq.id} published for ${newReq.configuration} in ${newReq.targetLocation}`,
        timestamp: 'Just now',
        tag: 'BUYER PURPLE',
        color: 'gray'
      };
      await run(`
        INSERT INTO activities (id, type, title, description, timestamp, tag, color)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [actReq.id, actReq.type, actReq.title, actReq.description, actReq.timestamp, actReq.tag, actReq.color]);

      // Find and calculate matching inventory listings
      const dbListingsRaw = await all<any>('SELECT * FROM listings');
      const dbListings = dbListingsRaw.map(r => ({
        ...r,
        tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags
      }));

      for (const listing of dbListings) {
        const matchScore = calculateScore(listing, newReq);
        if (matchScore > 80) {
          const actMatch = {
            id: `ACT-M-${Date.now()}-${listing.id}`,
            type: 'match',
            title: 'Inventory Matched',
            description: `${listing.title} matches your new requirement (${matchScore}% Match Score)`,
            timestamp: 'Just now',
            tag: 'SUCCESS GREEN',
            color: 'green'
          };
          await run(`
            INSERT INTO activities (id, type, title, description, timestamp, tag, color)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [actMatch.id, actMatch.type, actMatch.title, actMatch.description, actMatch.timestamp, actMatch.tag, actMatch.color]);
        }
      }

      res.status(201).json(newReq);
    } catch (err: any) {
      console.error("POST /api/requirements error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/activities', async (req, res) => {
    try {
      const activities = await all<LogActivity>('SELECT * FROM activities ORDER BY rowid DESC');
      res.json(activities);
    } catch (err: any) {
      console.error("GET /api/activities error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/activities/clear', async (req, res) => {
    try {
      await run('DELETE FROM activities');
      res.json({ message: 'Cleared' });
    } catch (err: any) {
      console.error("POST /api/activities/clear error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Unique Single-Page PHP Export Endpoint for Hostinger Custom Deployment!
  app.get('/api/export-php', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="zsetu.php"');
    
    // Construct single-file gorgeous PHP/HTML code
    const phpCode = `<?php
/**
 * Zsetu - Institutional Real Estate Exchange
 * Hostinger Custom Deployment Package (PHP + Tailwind + Live Mockups)
 * Strictly conforms to custom HTML template design guidelines.
 */

session_start();

// Simple PHP Session Database
if (!isset($_SESSION['listings'])) {
    $_SESSION['listings'] = [
        [
            'id' => 'DB-4921',
            'title' => 'Prime Commercial Complex',
            'type' => 'Commercial',
            'location' => 'Mayfair W1, London',
            'budgetRange' => '$40M - $45M',
            'configuration' => 'Grade A Corporate Office Space, 8 floors',
            'totalSize' => '22,400 SQ FT',
            'paymentMethod' => 'Escrow / Smart Contract',
            'purpose' => 'Sale',
            'valuation' => '$42.5M',
            'yieldOpt' => 'Yield: 6.5%',
            'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0Ki-7X9Z9KSHjlO9E8T3-EXMdWO3hpCg3i0xdPC9PZntJwwj6a_lJszZ6N-FEkCZ_z18vcDoNAT-oBsV0Z5kJpz40qJxIgT2Hwm4rsjA0BBNjUF3PpmwYAF-T9x1ll5zWQ0NJEiNUR5icva7O5huSRpWeMZLBeIHnyPkTLO6xGQmQAOiws0AgckDQafWHyJo-_56Cx6rZiKc718SMq1zSLq15PxD5_4WPsmPLEKSClv_BNs4Gbt8Y7v_r5MlS0a0FyDM-3Qsu5ixp',
            'tags' => ['Leased', 'Fiber Optic Ready', 'A-Grade', 'LEED Certified'],
            'matchScore' => 98
        ],
        [
            'id' => 'DB-5022',
            'title' => 'Metro Logistics Hub',
            'type' => 'Industrial',
            'location' => 'Jurong Industrial Estate, Singapore',
            'budgetRange' => '$15M - $20M',
            'configuration' => 'Bare Shell Warehousing, Grade A High Floor Class',
            'totalSize' => '24,000 SQ FT',
            'paymentMethod' => 'Wire Transfer',
            'purpose' => 'Sale',
            'valuation' => '$18.2M',
            'yieldOpt' => 'Yield: 7.2%',
            'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAheSKeQ6_5O-Rx39JYmBWF7lsL_nmVHaDduAQPTxDxDx9gZtkZ0fgbJBfPLPYgcaD_ALy-VTewUOZVHOe3mdfT1LvwBHK2eKHoUjZyuRjUYbJ0sETain64PfAOcAokeqKOSpYROZ18Knp5gs4TId_62Ei8CkRZG_l39HLO7rPZfg2ehYnUtI0IkjouwQvGPx_z9WYKf7eomwSo7HOG8jm61uNBQkKtWvSDutFY_VnIm-uwghQAaECEJW4iB0LOKqqk--Cdbkz006b2',
            'tags' => ['Full Occupancy', 'Logistics', 'Solar Ready', '24/7 Security'],
            'matchScore' => 92
        ],
        [
            'id' => 'DB-2191',
            'title' => 'Orchard Gateway Plaza',
            'type' => 'Retail',
            'location' => 'Orchard Road Corridor, Singapore',
            'budgetRange' => '$120M - $130M',
            'configuration' => 'Multi-Anchor Retail Complex',
            'totalSize' => '45,000 SQ FT',
            'paymentMethod' => 'Institutional Bank Transfer',
            'purpose' => 'Sale',
            'valuation' => '$125.0M',
            'yieldOpt' => 'Yield: 5.8%',
            'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAFhl3cweX4il3IQAn3jdjynNGcTFo0ddf8cH0I2qXsePRPF0PlPT-wqPIAixrfFZuz_xQ40QEuh-cAjhDmbQBZq7zXGcS5qgYYIFjLlCeON7Ik0E_AzGM-OkWrl2m52Ndie_PylJyj65bvlllwQGVoL_vdbjFV4rHMiz9GljN8idapY-wquAXnvbuRZBrrGJmzwLQFuUwNPISWwjrrOkxYUaew96s3UKp0mKoKZjKP-xDtRhnzerIf80zNG0pWYTTn5RM-cPUfQeC',
            'tags' => ['Mixed-Use', 'Prime Location', 'High Footfall', 'Executive Lounge'],
            'matchScore' => 85
        ]
    ];
}

if (!isset($_SESSION['requirements'])) {
    $_SESSION['requirements'] = [
        [
            'id' => 'REQ-101',
            'targetLocation' => 'Mayfair District, London',
            'sizeRequired' => '15,000 - 25,000 SQ FT',
            'societyName' => 'Mayfair Commercial Plaza',
            'configuration' => 'Grade A Office Space',
            'minBudget' => '$5M',
            'maxBudget' => '$10M',
            'paymentMethod' => 'Escrow / Smart Contract',
            'purpose' => 'Investment'
        ]
    ];
}

// Handle Form Submissions via POST
$postedSuccess = false;
$postedType = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'add_listing') {
        $newListing = [
            'id' => 'DB-' . rand(1000, 9999),
            'title' => htmlspecialchars($_POST['title'] ?? 'Generic Complex'),
            'type' => htmlspecialchars($_POST['type'] ?? 'Commercial'),
            'location' => htmlspecialchars($_POST['location'] ?? 'Central District'),
            'budgetRange' => htmlspecialchars($_POST['budgetRange'] ?? '$5M - $10M'),
            'configuration' => htmlspecialchars($_POST['configuration'] ?? 'Grade A Area'),
            'totalSize' => htmlspecialchars($_POST['totalSize'] ?? '15,000 SQ FT'),
            'paymentMethod' => htmlspecialchars($_POST['paymentMethod'] ?? 'Escrow / Smart Contract'),
            'purpose' => htmlspecialchars($_POST['purpose'] ?? 'Sale'),
            'valuation' => htmlspecialchars($_POST['valuation'] ?? '$8.5M'),
            'yieldOpt' => 'Yield: ' . rand(5, 8) . '.' . rand(0, 9) . '%',
            'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-w0Q4gbbfbS_oqD5MwWEz1Nfouy05SO44KEEYH65MiijkU33SOxEe_KlP4DioGpSL55mESrArWNM-bfLd6qSDkY2CbwfHLqiyaHkHhowgngBKxNTbGFybj5AhQj6PzfkXu5zyJIVIMM-8ZLU1U59_2MOJHXAARhCf2-yAq013ntXKH7k_QstSWQXHxtlaAMuKh7gRqf9rFVSkN7jPri3N9FjyScT8heAM9gBGfvRK2-A0fNThHOGKRp5TaYiA8xIQa4DnOawkBlWL',
            'tags' => ['Active Listing', 'Verified Security', 'Integrated Fiber'],
            'matchScore' => rand(85, 98)
        ];
        array_unshift($_SESSION['listings'], $newListing);
        $postedSuccess = true;
        $postedType = 'listing';
    } else if (isset($_POST['action']) && $_POST['action'] === 'add_requirement') {
        $newReq = [
            'id' => 'REQ-' . rand(100, 999),
            'targetLocation' => htmlspecialchars($_POST['targetLocation'] ?? 'London CBD'),
            'sizeRequired' => htmlspecialchars($_POST['sizeRequired'] ?? '20,000 SQ FT'),
            'societyName' => htmlspecialchars($_POST['societyName'] ?? 'Elite Block'),
            'configuration' => htmlspecialchars($_POST['configuration'] ?? 'Grade A Space'),
            'minBudget' => htmlspecialchars($_POST['minBudget'] ?? '$1M'),
            'maxBudget' => htmlspecialchars($_POST['maxBudget'] ?? '$5M'),
            'paymentMethod' => htmlspecialchars($_POST['paymentMethod'] ?? 'Wire Transfer'),
            'purpose' => htmlspecialchars($_POST['purpose'] ?? 'Investment')
        ];
        array_unshift($_SESSION['requirements'], $newReq);
        $postedSuccess = true;
        $postedType = 'requirement';
    }
}

// Current Route View
$view = $_GET['view'] ?? 'landing';
?>
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zsetu | Institutional Real Estate Exchange</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
    <!-- Icon and Font libraries -->
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        background: "#031427",
                        surface: "#031427",
                        onSurface: "#d3e4fe",
                        primary: "#bec6e0",
                        secondary: "#7bd0ff",
                        tertiary: "#4ae176"
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #031427;
            font-family: 'Manrope', 'Inter', sans-serif;
            color: #d3e4fe;
        }
        .header-bg {
            background: rgba(3, 20, 39, 0.95);
            backdrop-filter: blur(8px);
        }
    </style>
</head>
<body class="bg-background min-h-screen flex flex-col justify-between">

    <!-- Global Header -->
    <header class="fixed top-0 w-full z-50 header-bg border-b border-slate-800 h-16 flex items-center justify-between px-6">
        <a href="?view=landing" class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#7bd0ff]" style="font-variation-settings: 'FILL' 1;">handshake</span>
            <span class="text-xl font-bold font-display text-white tracking-tight">Zsetu</span>
        </a>
        <nav class="hidden md:flex gap-6 items-center">
            <a href="?view=landing" class="text-sm font-semibold transition-colors <?php echo $view === 'landing' ? 'text-[#7bd0ff]' : 'text-slate-300 hover:text-white'; ?>">Home</a>
            <a href="?view=agent_portal" class="text-sm font-semibold transition-colors <?php echo $view === 'agent_portal' ? 'text-[#7bd0ff]' : 'text-slate-300 hover:text-white'; ?>">Agent Portal</a>
            <a href="?view=buyer_portal" class="text-sm font-semibold transition-colors <?php echo $view === 'buyer_portal' ? 'text-[#7bd0ff]' : 'text-slate-300 hover:text-white'; ?>">Buyer Room</a>
            <a href="?view=explore" class="text-sm font-semibold transition-colors <?php echo $view === 'explore' ? 'text-[#7bd0ff]' : 'text-slate-300 hover:text-white'; ?>">Market Feed</a>
        </nav>
        <div class="flex items-center gap-3">
            <span class="text-xs font-mono bg-slate-800 text-slate-400 px-3 py-1 rounded">Hostinger V1</span>
            <div class="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-500">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzBWdFHOMYCmbhbCl8DUmOxJlrGR49fcC4VCzYJb82lMpKyAVVWoyC7iqQxjWZQ8AtAUb9IBOgd0tGWu3PcM9I2SQVSMJsW8PAR9t8i0gYO_cbfnJ7mRDvTrL1tNw7Gvpkbntb00Tw9DwUGS2xW8SZ8k41ft5Q5wFAj5g71iS9vlA_-tCjcKQs7NtG16moSA3NWXisct67lweTWxmOW4dSu3zbeix8i06z4Yy8HSVqA_Etr_6gyhCIjm1qfMx1-EejVvF8SWjOItVZ" class="w-full h-full object-cover">
            </div>
        </div>
    </header>

    <main class="pt-24 pb-12 flex-grow max-w-7xl mx-auto w-full px-6">

        <!-- Success overlay if posted -->
        <?php if ($postedSuccess): ?>
            <div class="mb-8 p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between animate-pulse">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
                    <div>
                        <h4 class="font-bold text-white text-lg"><?php echo $postedType === 'listing' ? 'Inventory Posted Successfully' : 'Requirements Submitted'; ?></h4>
                        <p class="text-slate-300 text-sm">Your information is now live in the security ledger network.</p>
                    </div>
                </div>
                <a href="?view=landing" class="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-bold">Dismiss</a>
            </div>
        <?php endif; ?>

        <?php if ($view === 'landing'): ?>
            <!-- Hero Section -->
            <div class="text-center max-w-3xl mx-auto space-y-6 pt-8 pb-12">
                <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00a6e0]/10 text-[#7bd0ff] rounded-full text-xs font-semibold">
                    <span class="material-symbols-outlined text-xs">verified</span> Join 500+ Top Agencies
                </span>
                <h1 class="text-5xl font-extrabold text-white leading-tight font-display">Bridge the Gap Between Demand and Inventory</h1>
                <p class="text-slate-300 text-lg">The institutional exchange for real estate professionals. High-velocity matching for agents and enterprise buyers.</p>
                <div class="flex justify-center gap-4 pt-4">
                    <a href="?view=agent_portal&sub=partnership" class="px-8 py-3.5 bg-[#7bd0ff] text-slate-900 font-bold rounded-lg transition-transform hover:scale-105">Get Started as Agent</a>
                    <a href="?view=buyer_portal&sub=profile" class="px-8 py-3.5 border-2 border-[#7bd0ff] text-[#7bd0ff] font-bold rounded-lg hover:bg-slate-800 transition-colors">Join as Buyer</a>
                </div>
            </div>

            <!-- Bento Entrance Card -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                    <div class="space-y-4">
                        <span class="text-xs uppercase font-mono tracking-wider text-[#7bd0ff]">Agent Side</span>
                        <h3 class="text-2xl font-bold text-white">Post Inventory. Manage Leads.</h3>
                        <p class="text-slate-400">Streamline your sales funnel with real-time requirement matches from verified shadow buyers.</p>
                    </div>
                    <a href="?view=agent_portal" class="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm font-semibold flex items-center justify-between">
                        <span>Authenticate Agent</span>
                        <span class="material-symbols-outlined shrink-0">arrow_forward</span>
                    </a>
                </div>

                <div class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                    <div class="space-y-4">
                        <span class="text-xs uppercase font-mono tracking-wider text-emerald-400">Buyer Side</span>
                        <h3 class="text-2xl font-bold text-white">Find Requirements. Match Deals.</h3>
                        <p class="text-slate-400">Scale your portfolio by connecting directly with audited listings across multiple territories.</p>
                    </div>
                    <a href="?view=buyer_portal" class="mt-8 px-6 py-3 border border-[#7bd0ff] text-[#7bd0ff] hover:bg-slate-800 rounded text-sm font-semibold flex items-center justify-between">
                        <span>Enter Buyer Room</span>
                        <span class="material-symbols-outlined shrink-0">person_search</span>
                    </a>
                </div>
            </div>

        <?php elseif ($view === 'agent_portal'): ?>
            <!-- Agent Side Workspace -->
            <?php if (($_GET['sub'] ?? '') === 'partnership'): ?>
                <!-- Partnership Application Stepper -->
                <div class="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                    <h2 class="text-2xl font-bold text-white">Apply for Partnership</h2>
                    <p class="text-slate-400">Step 1 of 3: Firm Details (33% Complete)</p>
                    <div class="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-[#7bd0ff] w-1/3"></div>
                    </div>
                    <form method="POST" action="?view=agent_portal" class="space-y-4">
                        <input type="hidden" name="action" value="add_listing">
                        <div>
                            <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Company Name</label>
                            <input type="text" name="title" placeholder="e.g. Nexus Realty Systems" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:outline-none focus:border-[#7bd0ff]">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">City Location</label>
                                <input type="text" name="location" placeholder="e.g. Mayfair Office" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Total Size Goal</label>
                                <input type="text" name="totalSize" placeholder="e.g. 18,500 SQ FT" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                        </div>
                        <button type="submit" class="w-full py-4 bg-[#7bd0ff] text-slate-900 rounded font-bold hover:opacity-90">Submit Application</button>
                    </form>
                </div>
            <?php else: ?>
                <!-- Standard Agent Dashboard and Posting -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div class="lg:col-span-4 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl h-fit space-y-6">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded overflow-hidden">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn-nUCpaWnqcC1zsXBZKXgOpcBbwKeZhKjUX2oqZJwYCW3O4USfRvD6y3IVqpSbe5f9v4PT8pskBwdUF5gBm_UBvUMm39dttBXmaJ5WdRngBp_R8x1pW5Rgz-XrJHXPP-fsng4eM5cU4WKnH5TAyAihfK6W1xv9IOuBmr5vT7Tx55vzc6y2rbzp1X-cz8ce5u6yuj3REisTDK4K8L3PtOoiIxO_7o2rBoQeGf6iSma1z_yZ02eRPxw-GoWK8KwICTDYGVpWuepaA22" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-white">Alexander Sterling</h3>
                                <p class="text-xs text-[#7bd0ff] uppercase font-mono">Principal Broker</p>
                            </div>
                        </div>
                        <div class="space-y-2 border-t border-slate-800 pt-4 text-sm text-slate-300">
                            <p><strong>Firm:</strong> Sterling Global Realty</p>
                            <p><strong>RERA ID:</strong> #RERA-8832-TX-2024</p>
                        </div>
                        <a href="?view=agent_portal&sub=partnership" class="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-center text-white rounded text-sm font-semibold">Apply for Partnership</a>
                    </div>

                    <div class="lg:col-span-8 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
                        <h2 class="text-xl font-bold text-white mb-6">Register Commercial Property</h2>
                        <form method="POST" class="space-y-4">
                            <input type="hidden" name="action" value="add_listing">
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Asset Title Name</label>
                                <input type="text" name="title" required placeholder="e.g. Skyline Landmark Towers" class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Asset Class Type</label>
                                    <select name="type" class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                                        <option>Commercial</option>
                                        <option>Industrial</option>
                                        <option>Retail</option>
                                        <option>Multi-Family</option>
                                        <option>Data Center</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Location Zone</label>
                                    <input type="text" name="location" required placeholder="e.g. Mayfair, London" class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Total Area (SQ FT)</label>
                                    <input type="text" name="totalSize" placeholder="e.g. 18,500 SQ FT" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                                </div>
                                <div>
                                    <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Valuation Amount</label>
                                    <input type="text" name="valuation" placeholder="e.g. $42.5M" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                                </div>
                                <div>
                                    <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Payment Option</label>
                                    <select name="paymentMethod" class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                                        <option>Escrow / Smart Contract</option>
                                        <option>Wire Transfer</option>
                                        <option>Crypto Settlement</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="w-full py-4 bg-[#7bd0ff] text-slate-900 rounded font-bold hover:opacity-90">Post Inventory</button>
                        </form>
                    </div>
                </div>
            <?php endif; ?>

        <?php elseif ($view === 'buyer_portal'): ?>
            <!-- Buyer Room Submissions -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div class="lg:col-span-4 space-y-6">
                    <div class="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-16 h-16 rounded overflow-hidden">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXu-t4tFILC86BV5-pups-w_Ab5jKF1wSyo2glfXkwvivWX-IkdzOSKym8yV9290ARGk9bhS6ks7vSyxIk7Afgcw1wuWXPCa9CyJaVtS2ja7TzqCu6ago22GY5sjqqx8dSTfPthQ16cw-tD8ZQiYFNVH2XDiTCaD9pac-2sIuC6Ss9pps_y7O281NnswK88-Rbqq1H6KJ23FpIRdA-pmRPYj8PHExB5M0mbhGc5ThKHMrJ8nvgXzIfcMsgsq0iEEqJUB_Fh8u9GRQEgz" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-white">Marcus Thorne</h3>
                                <p class="text-xs text-emerald-400 font-mono font-bold">Thorne Capital Partners</p>
                            </div>
                        </div>
                        <div class="space-y-4 border-t border-slate-800 pt-4 text-xs font-mono">
                            <div class="h-1 bg-slate-800 rounded overflow-hidden">
                                <div class="bg-emerald-400 h-full w-[84%]"></div>
                            </div>
                            <p class="text-slate-300">CLOSING INDEX: <span class="text-emerald-400">84.2%</span></p>
                        </div>
                    </div>

                    <div class="p-6 bg-[#001d07]/20 border border-emerald-800/30 rounded-2xl">
                        <h4 class="text-md font-bold text-white mb-2">V-Data Integrity</h4>
                        <p class="text-slate-400 text-sm">Security logs validated on institutional ledger node #RERA-8832.</p>
                    </div>
                </div>

                <div class="lg:col-span-8 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
                    <h2 class="text-xl font-bold text-white mb-6">Add Acquisition Requirement</h2>
                    <form method="POST" class="space-y-4">
                        <input type="hidden" name="action" value="add_requirement">
                        <div>
                            <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Target Location</label>
                            <input type="text" name="targetLocation" required placeholder="e.g. Mayfair, London" class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Required Configuration</label>
                                <input type="text" name="configuration" required placeholder="e.g. Grade A Office Space" class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Society / Building Name</label>
                                <input type="text" name="societyName" placeholder="e.g. Prime Block" class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Size Needed</label>
                                <input type="text" name="sizeRequired" placeholder="e.g. 15,000 - 25,000 SQ FT" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Min Budget Limit</label>
                                <input type="text" name="minBudget" placeholder="e.g. $5M" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                            <div>
                                <label class="block text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Max Budget Limit</label>
                                <input type="text" name="maxBudget" placeholder="e.g. $10M" required class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white">
                            </div>
                        </div>
                        <button type="submit" class="w-full py-4 bg-emerald-500 text-[#001d07] rounded font-bold hover:opacity-90">Search matches</button>
                    </form>
                </div>
            </div>

        <?php elseif ($view === 'explore'): ?>
            <!-- Market feed explore -->
            <div class="space-y-6">
                <div>
                    <h2 class="text-3xl font-bold text-white mb-2 font-display">Audited Market Listings</h2>
                    <p class="text-slate-400">Discover exclusive enterprise opportunities synced with live matching scores.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <?php foreach ($_SESSION['listings'] as $list): ?>
                        <div class="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-[#7bd0ff] transition-all">
                            <div class="h-48 relative overflow-hidden">
                                <img src="<?php echo $list['image']; ?>" class="w-full h-full object-cover">
                                <span class="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 text-xs text-[#7bd0ff] font-bold rounded-full font-mono"><?php echo $list['type']; ?></span>
                                <span class="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500/90 text-xs text-white font-bold rounded-full"><?php echo $list['matchScore'] ?? '94'; ?>% Match</span>
                            </div>
                            <div class="p-6 space-y-4">
                                <div>
                                    <h4 class="text-lg font-bold text-white"><?php echo $list['title']; ?></h4>
                                    <p class="text-sm text-slate-400 mt-1 flex items-center gap-1">
                                        <span class="material-symbols-outlined text-xs">location_on</span>
                                        <?php echo $list['location']; ?>
                                    </p>
                                </div>
                                <div class="flex justify-between items-center text-xs text-slate-400">
                                    <span>Valuation</span>
                                    <span class="text-lg font-bold text-[#7bd0ff] font-mono"><?php echo $list['valuation']; ?></span>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

    </main>

    <!-- Global Footer -->
    <footer class="bg-slate-950 border-t border-slate-800 py-6 mt-12">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <div>
                <p>&copy; 2026 Zsetu. Secure Institutional Real Estate Ledger. All rights reserved.</p>
            </div>
            <div class="flex gap-4">
                <a href="#" class="hover:text-white">Support Services</a>
                <a href="#" class="hover:text-white">Node Verification</a>
                <a href="#" class="hover:text-white">Help Room</a>
            </div>
        </div>
    </footer>

</body>
</html>
`;
    res.send(phpCode);
  });

  // Serve static assets in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
