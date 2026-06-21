import fs from 'fs/promises';
import { INITIAL_LISTINGS, INITIAL_REQUIREMENTS, INITIAL_ACTIVITIES } from './src/data.js';
import { InventoryItem, BuyerRequirement, LogActivity } from './src/types.js';

const DB_FILE = './deal_bridge_data.json';

interface DbSchema {
  listings: any[];
  requirements: any[];
  activities: any[];
}

let cache: DbSchema = {
  listings: [],
  requirements: [],
  activities: []
};

let isInitialized = false;

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function saveDb(): Promise<void> {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving database to file:", err);
  }
}

export async function initDb(): Promise<void> {
  if (isInitialized) return;

  if (await exists(DB_FILE)) {
    try {
      const data = await fs.readFile(DB_FILE, 'utf-8');
      cache = JSON.parse(data);
      isInitialized = true;
      console.log("Database loaded from", DB_FILE);
      return;
    } catch (err) {
      console.error("Failed to parse database file, re-initializing:", err);
    }
  }

  // Seeding step
  console.log("Seeding Database...");
  cache.listings = INITIAL_LISTINGS.map(item => ({
    ...item,
    tags: JSON.stringify(item.tags) // store as JSON string like SQLite
  }));
  cache.requirements = [...INITIAL_REQUIREMENTS];
  cache.activities = [...INITIAL_ACTIVITIES];

  await saveDb();
  isInitialized = true;
}

export async function run(sql: string, params: any[] = []): Promise<void> {
  await initDb();
  const sqlUpper = sql.toUpperCase();

  if (sqlUpper.includes('INSERT INTO LISTINGS')) {
    const [
      id, title, type, location, budgetRange, configuration, totalSize,
      paymentMethod, purpose, valuation, yieldOpt, status, image, tags,
      description, matchScore
    ] = params;

    cache.listings.push({
      id, title, type, location, budgetRange, configuration, totalSize,
      paymentMethod, purpose, valuation, yieldOpt, status, image, tags,
      description, matchScore
    });
    await saveDb();
  } else if (sqlUpper.includes('INSERT INTO REQUIREMENTS')) {
    const [
      id, buyerId, targetLocation, sizeRequired, societyName, configuration,
      minBudget, maxBudget, paymentMethod, purpose
    ] = params;

    cache.requirements.push({
      id, buyerId, targetLocation, sizeRequired, societyName, configuration,
      minBudget, maxBudget, paymentMethod, purpose
    });
    await saveDb();
  } else if (sqlUpper.includes('INSERT INTO ACTIVITIES')) {
    const [id, type, title, description, timestamp, tag, color] = params;

    cache.activities.push({
      id, type, title, description, timestamp, tag, color
    });
    await saveDb();
  } else if (sqlUpper.includes('DELETE FROM ACTIVITIES')) {
    cache.activities = [];
    await saveDb();
  } else {
    console.warn("Unrecognized run query:", sql, params);
  }
}

export async function all<T>(sql: string, params: any[] = []): Promise<T[]> {
  await initDb();
  const sqlUpper = sql.toUpperCase();

  if (sqlUpper.includes('FROM LISTINGS')) {
    const list = [...cache.listings];
    if (sqlUpper.includes('ORDER BY')) {
      list.reverse();
    }
    return list as unknown as T[];
  } else if (sqlUpper.includes('FROM REQUIREMENTS')) {
    const list = [...cache.requirements];
    if (sqlUpper.includes('ORDER BY')) {
      list.reverse();
    }
    return list as unknown as T[];
  } else if (sqlUpper.includes('FROM ACTIVITIES')) {
    const list = [...cache.activities];
    if (sqlUpper.includes('ORDER BY')) {
      list.reverse();
    }
    return list as unknown as T[];
  }

  console.warn("Unrecognized all query:", sql);
  return [];
}

export async function get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  await initDb();
  const list = await all<T>(sql, params);
  return list[0];
}

export const db = {
  serialize: (cb: () => void) => cb(),
  run: (sql: string, cb?: (err: any) => void) => { if (cb) cb(null); },
  get: (sql: string, cb: (err: any, row: any) => void) => cb(null, { count: 1 })
};
