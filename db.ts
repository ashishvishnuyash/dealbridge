import fs from 'fs/promises';
import { initializeApp } from "firebase/app";
import { 
  initializeFirestore,
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  terminate
} from "firebase/firestore";
import { INITIAL_LISTINGS, INITIAL_REQUIREMENTS, INITIAL_ACTIVITIES, INITIAL_AGENTS, INITIAL_BUYERS } from './src/data.js';
import { InventoryItem, BuyerRequirement, LogActivity } from './src/types.js';

const DB_FILE = './deal_bridge_data.json';

// User's customized Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_dTn-0TXXSHoUf1dhcSeklaZRDmkUOhk",
  authDomain: "zsetu-5ea71.firebaseapp.com",
  databaseURL: "https://zsetu-5ea71-default-rtdb.firebaseio.com",
  projectId: "zsetu-5ea71",
  storageBucket: "zsetu-5ea71.firebasestorage.app",
  messagingSenderId: "814171499363",
  appId: "1:814171499363:web:b130481540e0f7af668156",
  measurementId: "G-MNRJ448LEJ"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Keep db as a module-level variable initialized lazily
export let db: any = null;

function initFirestoreInstance() {
  if (!db) {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: undefined // default transient cache
    });
  }
  return db;
}

interface DbSchema {
  listings: any[];
  requirements: any[];
  activities: any[];
  agents: any[];
  buyers: any[];
}

let cache: DbSchema = {
  listings: [],
  requirements: [],
  activities: [],
  agents: [],
  buyers: []
};

let isInitialized = false;
let useLocalCache = false;

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function saveLocalDb(): Promise<void> {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving backup database to file:", err);
  }
}

/**
 * Executes a promise with a timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2000): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Firebase query timed out"));
    }, timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

/**
 * Pings the public REST API to check if the Firestore database is enabled/created on the Google Cloud project.
 * If the API is disabled or not used yet, we bypass initializing the SDK to avoid endless gRPC stream connection logs.
 */
async function checkFirestoreEnabled(): Promise<boolean> {
  const checkUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/listings?key=${firebaseConfig.apiKey}`;
  try {
    const res = await fetch(checkUrl);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.error?.message || "";
      if (
        msg.includes("does not exist") || 
        msg.includes("not been used") || 
        msg.includes("disabled") ||
        msg.includes("Permission denied") ||
        msg.includes("PERMISSION_DENIED")
      ) {
        console.warn("\n==========================================================================");
        console.warn("WARNING: Cloud Firestore has not been configured/enabled in Firebase console.");
        console.warn("Details:", msg);
        console.warn("Please create a Firestore database at https://console.firebase.google.com/project/zsetu-5ea71/firestore");
        console.warn("Bypassing Firebase SDK background connection to prevent logging floods.");
        console.warn("Using high-performance local offline JSON storage active database instead.");
        console.warn("==========================================================================\n");
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn("Network ping to Firestore check endpoint failed (using offline fallback):", err);
    return false;
  }
}

/**
 * Initializes and seeds the database collections.
 */
export async function initDb(): Promise<void> {
  if (isInitialized) return;

  try {
    console.log("Checking if Cloud Firestore is active on project zsetu-5ea71...");
    const isEnabled = await checkFirestoreEnabled();
    
    if (!isEnabled) {
      throw new Error("Cloud Firestore is either disabled or its default database has not been created.");
    }

    // Initialize Firestore instance lazily
    initFirestoreInstance();

    console.log("Testing Firestore connectivity to project zsetu-5ea71...");
    // Try checking Firestore with a strict 2-second timeout
    const querySnapshot = await withTimeout(getDocs(collection(db, "listings")), 2000);
    
    if (querySnapshot.empty) {
      console.log("Seeding Firestore 'listings' collection with initial data...");
      for (const item of INITIAL_LISTINGS) {
        await setDoc(doc(db, "listings", item.id), {
          ...item,
          tags: item.tags,
          createdAt: new Date().toISOString()
        });
      }

      console.log("Seeding Firestore 'requirements' collection with initial data...");
      for (const item of INITIAL_REQUIREMENTS) {
        await setDoc(doc(db, "requirements", item.id), {
          ...item,
          createdAt: new Date().toISOString()
        });
      }

      console.log("Seeding Firestore 'activities' collection with initial data...");
      for (const item of INITIAL_ACTIVITIES) {
        await setDoc(doc(db, "activities", item.id), {
          ...item,
          createdAt: new Date().toISOString()
        });
      }

      console.log("Seeding Firestore 'agents' collection with initial data...");
      for (const item of INITIAL_AGENTS) {
        await setDoc(doc(db, "agents", item.id), {
          ...item,
          password: 'password123',
          createdAt: new Date().toISOString()
        });
      }

      console.log("Seeding Firestore 'buyers' collection with initial data...");
      for (const item of INITIAL_BUYERS) {
        await setDoc(doc(db, "buyers", item.id), {
          ...item,
          password: 'password123',
          createdAt: new Date().toISOString()
        });
      }
    } else {
      // Even if listings is not empty, check if agents/buyers collections are empty and need seeding
      try {
        const agentsSnapshot = await withTimeout(getDocs(collection(db, "agents")), 1500);
        if (agentsSnapshot.empty) {
          console.log("Firestore 'agents' is empty. Seeding agents...");
          for (const item of INITIAL_AGENTS) {
            await setDoc(doc(db, "agents", item.id), {
              ...item,
              password: 'password123',
              createdAt: new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.warn("Could not check/seed agents in Firestore:", e);
      }

      try {
        const buyersSnapshot = await withTimeout(getDocs(collection(db, "buyers")), 1500);
        if (buyersSnapshot.empty) {
          console.log("Firestore 'buyers' is empty. Seeding buyers...");
          for (const item of INITIAL_BUYERS) {
            await setDoc(doc(db, "buyers", item.id), {
              ...item,
              password: 'password123',
              createdAt: new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.warn("Could not check/seed buyers in Firestore:", e);
      }
    }
    useLocalCache = false;
    isInitialized = true;
    console.log("SUCCESS: Connected to live Firebase Firestore. Active database is online.");
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn("\n==========================================================================");
    console.warn("WARNING: Firebase Cloud Firestore is either not enabled or unreachable.");
    console.warn("Details:", errorMsg);
    console.warn("Falling back gracefully to local offline JSON storage cache.");
    console.warn("==========================================================================\n");
    
    useLocalCache = true;
    
    // Terminate Firestore client to stop background long-polling or retry tasks
    if (db) {
      try {
        await terminate(db);
        console.log("Firestore network streaming active connections terminated successfully.");
      } catch (termErr) {
        console.error("Error terminating Firestore:", termErr);
      }
    }
    
    // Load data from local JSON database cache file
    if (await fileExists(DB_FILE)) {
      try {
        const data = await fs.readFile(DB_FILE, 'utf-8');
        cache = JSON.parse(data);
        if (!cache.agents) {
          cache.agents = INITIAL_AGENTS.map(item => ({
            ...item,
            password: 'password123',
            createdAt: new Date().toISOString()
          }));
        }
        if (!cache.buyers) {
          cache.buyers = INITIAL_BUYERS.map(item => ({
            ...item,
            password: 'password123',
            createdAt: new Date().toISOString()
          }));
        }
        isInitialized = true;
        console.log("Local backup database cache loaded from", DB_FILE);
        return;
      } catch (fileErr) {
        console.error("Failed to parse local database file, re-initializing:", fileErr);
      }
    }

    // Seed local cache memory
    cache.listings = INITIAL_LISTINGS.map(item => ({
      ...item,
      tags: item.tags,
      createdAt: new Date().toISOString()
    }));
    cache.requirements = INITIAL_REQUIREMENTS.map(item => ({
      ...item,
      createdAt: new Date().toISOString()
    }));
    cache.activities = INITIAL_ACTIVITIES.map(item => ({
      ...item,
      createdAt: new Date().toISOString()
    }));
    cache.agents = INITIAL_AGENTS.map(item => ({
      ...item,
      password: 'password123',
      createdAt: new Date().toISOString()
    }));
    cache.buyers = INITIAL_BUYERS.map(item => ({
      ...item,
      password: 'password123',
      createdAt: new Date().toISOString()
    }));

    await saveLocalDb();
    isInitialized = true;
  }
}

/**
 * Runs structural update queries.
 */
export async function run(sql: string, params: any[] = []): Promise<void> {
  await initDb();
  const sqlUpper = sql.toUpperCase();

  if (useLocalCache) {
    // Local SQLite Emulation logic
    if (sqlUpper.includes('INSERT INTO LISTINGS')) {
      const [
        id, title, type, location, budgetRange, configuration, totalSize,
        paymentMethod, purpose, valuation, yieldOpt, status, image, tagsRaw,
        description, matchScore
      ] = params;

      let tagsList: string[] = [];
      try {
        tagsList = typeof tagsRaw === 'string' ? JSON.parse(tagsRaw) : tagsRaw;
      } catch {
        tagsList = [];
      }

      cache.listings.push({
        id, title, type, location, budgetRange, configuration, totalSize,
        paymentMethod, purpose, valuation, yieldOpt, status, image, tags: tagsList,
        description, matchScore,
        createdAt: new Date().toISOString()
      });
      await saveLocalDb();
    } else if (sqlUpper.includes('INSERT INTO REQUIREMENTS')) {
      const [
        id, buyerId, targetLocation, sizeRequired, societyName, configuration,
        minBudget, maxBudget, paymentMethod, purpose
      ] = params;

      cache.requirements.push({
        id, buyerId, targetLocation, sizeRequired, societyName, configuration,
        minBudget, maxBudget, paymentMethod, purpose,
        createdAt: new Date().toISOString()
      });
      await saveLocalDb();
    } else if (sqlUpper.includes('INSERT INTO ACTIVITIES')) {
      const [id, type, title, description, timestamp, tag, color] = params;

      cache.activities.push({
        id, type, title, description, timestamp, tag, color,
        createdAt: new Date().toISOString()
      });
      await saveLocalDb();
    } else if (sqlUpper.includes('DELETE FROM ACTIVITIES')) {
      cache.activities = [];
      await saveLocalDb();
    } else if (sqlUpper.includes('INSERT INTO AGENTS')) {
      const [id, name, companyName, mobileNo, emailId, reraNo, avatarUrl, password] = params;
      cache.agents.push({
        id, name, companyName, mobileNo, emailId, reraNo, avatarUrl, password,
        createdAt: new Date().toISOString()
      });
      await saveLocalDb();
    } else if (sqlUpper.includes('INSERT INTO BUYERS')) {
      const [id, name, companyName, mobileNo, emailId, reraNo, portfolioSize, primaryAssetClass, avatarUrl, password] = params;
      cache.buyers.push({
        id, name, companyName, mobileNo, emailId, reraNo, portfolioSize, primaryAssetClass, avatarUrl, password,
        createdAt: new Date().toISOString()
      });
      await saveLocalDb();
    }
    return;
  }

  // Real Firebase execution
  try {
    if (sqlUpper.includes('INSERT INTO LISTINGS')) {
      const [
        id, title, type, location, budgetRange, configuration, totalSize,
        paymentMethod, purpose, valuation, yieldOpt, status, image, tagsRaw,
        description, matchScore
      ] = params;

      let tagsList: string[] = [];
      try {
        tagsList = typeof tagsRaw === 'string' ? JSON.parse(tagsRaw) : tagsRaw;
      } catch {
        tagsList = [];
      }

      await setDoc(doc(db, "listings", id), {
        id, title, type, location, budgetRange, configuration, totalSize,
        paymentMethod, purpose, valuation, yieldOpt, status, image, 
        tags: tagsList,
        description, matchScore,
        createdAt: new Date().toISOString()
      });
    } else if (sqlUpper.includes('INSERT INTO REQUIREMENTS')) {
      const [
        id, buyerId, targetLocation, sizeRequired, societyName, configuration,
        minBudget, maxBudget, paymentMethod, purpose
      ] = params;

      await setDoc(doc(db, "requirements", id), {
        id, buyerId, targetLocation, sizeRequired, societyName, configuration,
        minBudget, maxBudget, paymentMethod, purpose,
        createdAt: new Date().toISOString()
      });
    } else if (sqlUpper.includes('INSERT INTO ACTIVITIES')) {
      const [id, type, title, description, timestamp, tag, color] = params;

      await setDoc(doc(db, "activities", id), {
        id, type, title, description, timestamp, tag, color,
        createdAt: new Date().toISOString()
      });
    } else if (sqlUpper.includes('DELETE FROM ACTIVITIES')) {
      const querySnapshot = await getDocs(collection(db, "activities"));
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, "activities", docSnap.id));
      }
    } else if (sqlUpper.includes('INSERT INTO AGENTS')) {
      const [id, name, companyName, mobileNo, emailId, reraNo, avatarUrl, password] = params;
      await setDoc(doc(db, "agents", id), {
        id, name, companyName, mobileNo, emailId, reraNo, avatarUrl, password,
        createdAt: new Date().toISOString()
      });
    } else if (sqlUpper.includes('INSERT INTO BUYERS')) {
      const [id, name, companyName, mobileNo, emailId, reraNo, portfolioSize, primaryAssetClass, avatarUrl, password] = params;
      await setDoc(doc(db, "buyers", id), {
        id, name, companyName, mobileNo, emailId, reraNo, portfolioSize, primaryAssetClass, avatarUrl, password,
        createdAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error("Error executing run on Firestore:", err);
    throw err;
  }
}

/**
 * Retrieves all items in a category.
 */
export async function all<T>(sql: string, params: any[] = []): Promise<T[]> {
  await initDb();
  const sqlUpper = sql.toUpperCase();

  if (useLocalCache) {
    if (sqlUpper.includes('FROM LISTINGS')) {
      const list = [...cache.listings];
      list.sort((a, b) => {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return dateB.localeCompare(dateA);
      });
      return list as unknown as T[];
    } else if (sqlUpper.includes('FROM REQUIREMENTS')) {
      const list = [...cache.requirements];
      list.sort((a, b) => {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return dateB.localeCompare(dateA);
      });
      return list as unknown as T[];
    } else if (sqlUpper.includes('FROM ACTIVITIES')) {
      const list = [...cache.activities];
      list.sort((a, b) => {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return dateB.localeCompare(dateA);
      });
      return list as unknown as T[];
    } else if (sqlUpper.includes('FROM AGENTS')) {
      return [...cache.agents] as unknown as T[];
    } else if (sqlUpper.includes('FROM BUYERS')) {
      return [...cache.buyers] as unknown as T[];
    }
    return [];
  }

  // Real Firebase execution
  try {
    if (sqlUpper.includes('FROM LISTINGS')) {
      const snap = await getDocs(collection(db, "listings"));
      const list: any[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data());
      });
      list.sort((a, b) => {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return dateB.localeCompare(dateA);
      });
      return list as unknown as T[];
    } else if (sqlUpper.includes('FROM REQUIREMENTS')) {
      const snap = await getDocs(collection(db, "requirements"));
      const list: any[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data());
      });
      list.sort((a, b) => {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return dateB.localeCompare(dateA);
      });
      return list as unknown as T[];
    } else if (sqlUpper.includes('FROM ACTIVITIES')) {
      const snap = await getDocs(collection(db, "activities"));
      const list: any[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data());
      });
      list.sort((a, b) => {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return dateB.localeCompare(dateA);
      });
      return list as unknown as T[];
    } else if (sqlUpper.includes('FROM AGENTS')) {
      const snap = await getDocs(collection(db, "agents"));
      const list: any[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data());
      });
      return list as unknown as T[];
    } else if (sqlUpper.includes('FROM BUYERS')) {
      const snap = await getDocs(collection(db, "buyers"));
      const list: any[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data());
      });
      return list as unknown as T[];
    }
  } catch (err) {
    console.error("Error retrieving collections from Firestore:", err);
    throw err;
  }

  console.warn("Unrecognized all query:", sql);
  return [];
}

/**
 * Helper to fetch a single matched item.
 */
export async function get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  await initDb();
  const list = await all<T>(sql, params);
  return list[0];
}
