import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONNECTIONS_FILE = path.join(DATA_DIR, 'connections.json');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'activity.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Helper to read file directly
function readJsonFile(filePath: string) {
  ensureDataDir();
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return [];
}

// Helper to write file directly
function writeJsonFile(filePath: string, data: any) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Type definitions
export interface Connection {
  id: string;
  name: string;
  robloxUserId: string;
  authToken: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected: string;
  createdAt: string;
}

export interface Account {
  id: string;
  connectionId: string;
  username: string;
  password: string;
  status: 'ready' | 'working' | 'error';
  lastActivity: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  accountId: string;
  connectionId: string;
  action: string;
  details: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
}

// Connections operations
export function getConnections(): Connection[] {
  return readJsonFile(CONNECTIONS_FILE);
}

export function saveConnections(connections: Connection[]): void {
  writeJsonFile(CONNECTIONS_FILE, connections);
}

export function getConnection(id: string): Connection | null {
  const connections = getConnections();
  return connections.find(c => c.id === id) || null;
}

export function createConnection(data: Omit<Connection, 'id' | 'createdAt'>): Connection {
  const connection: Connection = {
    ...data,
    id: `conn_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const connections = getConnections();
  connections.push(connection);
  saveConnections(connections);
  return connection;
}

export function updateConnection(id: string, data: Partial<Connection>): Connection | null {
  const connections = getConnections();
  const index = connections.findIndex(c => c.id === id);
  if (index === -1) return null;
  connections[index] = { ...connections[index], ...data };
  saveConnections(connections);
  return connections[index];
}

export function deleteConnection(id: string): boolean {
  // Read all data fresh
  let connections = getConnections();
  const initialLength = connections.length;
  connections = connections.filter(c => c.id !== id);
  
  if (connections.length === initialLength) return false;
  saveConnections(connections);
  
  // Delete all associated accounts
  let accounts = getAccounts();
  accounts = accounts.filter(a => a.connectionId !== id);
  saveAccounts(accounts);
  
  // Delete all associated activities
  let activities = getActivity();
  activities = activities.filter(a => a.connectionId !== id);
  saveActivity(activities);
  
  console.log(`Deleted connection ${id}, ${initialLength - connections.length} connections removed`);
  return true;
}

// Accounts operations
export function getAccounts(): Account[] {
  console.log('===== storage.getAccounts() =====');
  const rawAccounts = readJsonFile(ACCOUNTS_FILE);
  console.log('Raw accounts from file:', rawAccounts);
  
  // Sanitize accounts to ensure all required fields exist
  let needsToSave = false;
  const sanitizedAccounts = rawAccounts.map((account: any, index: number) => {
    // Check if we need to generate an ID first
    const hasMissingFields = !account.id || !account.username || !account.status || !account.lastActivity || !account.createdAt;
    if (hasMissingFields) {
      needsToSave = true;
    }
    const sanitized = {
      id: account.id || `acc_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      connectionId: account.connectionId,
      username: account.username || `Account ${index + 1}`,
      password: account.password || '',
      status: account.status || 'ready',
      lastActivity: account.lastActivity || new Date().toISOString(),
      createdAt: account.createdAt || new Date().toISOString(),
    };
    console.log(`Sanitized account ${index}:`, sanitized);
    return sanitized;
  });
  
  // Save back to file ONLY if we actually changed something
  if (needsToSave) {
    console.log('Saving sanitized accounts back to file:', sanitizedAccounts);
    saveAccounts(sanitizedAccounts);
  }
  
  console.log('Returning sanitized accounts:', sanitizedAccounts);
  return sanitizedAccounts;
}

export function saveAccounts(accounts: Account[]): void {
  writeJsonFile(ACCOUNTS_FILE, accounts);
}

export function getAccount(id: string): Account | null {
  const accounts = getAccounts();
  return accounts.find(a => a.id === id) || null;
}

export function getAccountsByConnection(connectionId: string): Account[] {
  const accounts = getAccounts();
  return accounts.filter(a => a.connectionId === connectionId);
}

export function createAccount(data: Omit<Account, 'id' | 'createdAt'>): Account {
  // Generate a unique ID with timestamp + random string to avoid duplicates
  const account: Account = {
    ...data,
    id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  // Read raw accounts without sanitizing to avoid ID changes
  const rawAccounts = readJsonFile(ACCOUNTS_FILE);
  rawAccounts.push(account);
  writeJsonFile(ACCOUNTS_FILE, rawAccounts);
  return account;
}

export function updateAccount(id: string, data: Partial<Account>): Account | null {
  const accounts = getAccounts();
  const index = accounts.findIndex(a => a.id === id);
  if (index === -1) return null;
  accounts[index] = { ...accounts[index], ...data };
  saveAccounts(accounts);
  return accounts[index];
}

export function deleteAccount(id: string): boolean {
  // Read raw accounts without sanitizing to speed things up
  const rawAccounts = readJsonFile(ACCOUNTS_FILE);
  const initialLength = rawAccounts.length;
  const remainingAccounts = rawAccounts.filter((a: any) => a.id !== id);

  if (remainingAccounts.length === initialLength) return false;
  
  writeJsonFile(ACCOUNTS_FILE, remainingAccounts);

  // Delete all associated activities
  const rawActivities = readJsonFile(ACTIVITY_FILE);
  const remainingActivities = rawActivities.filter((a: any) => a.accountId !== id);
  writeJsonFile(ACTIVITY_FILE, remainingActivities);

  console.log(`Deleted account ${id}`);
  return true;
}

export function deleteAccounts(ids: string[]): number {
  console.log('===== storage.deleteAccounts() =====');
  console.log('IDs to delete:', ids);
  
  // Read raw accounts without sanitizing to speed things up and avoid ID mismatches
  let rawAccounts = readJsonFile(ACCOUNTS_FILE);
  console.log('Raw accounts before delete:', rawAccounts);
  const initialLength = rawAccounts.length;
  
  // Log all account IDs in file
  console.log('Account IDs in file:', rawAccounts.map((a: any) => a.id));
  
  // Filter out the accounts to delete
  const remainingAccounts = rawAccounts.filter((a: any) => !ids.includes(a.id));
  const deletedCount = initialLength - remainingAccounts.length;
  console.log('Deleted count:', deletedCount);
  console.log('Remaining accounts:', remainingAccounts);

  if (deletedCount > 0) {
    // Save remaining accounts
    writeJsonFile(ACCOUNTS_FILE, remainingAccounts);
    console.log('Saved remaining accounts to file');

    // Delete all associated activities
    const rawActivities = readJsonFile(ACTIVITY_FILE);
    const remainingActivities = rawActivities.filter((a: any) => !ids.includes(a.accountId));
    writeJsonFile(ACTIVITY_FILE, remainingActivities);

    console.log(`Deleted ${deletedCount} accounts and their associated activities`);
  }

  return deletedCount;
}

// Activity operations
export function getActivity(): Activity[] {
  return readJsonFile(ACTIVITY_FILE);
}

export function saveActivity(activity: Activity[]): void {
  writeJsonFile(ACTIVITY_FILE, activity);
}

export function getActivityForAccount(accountId: string, limit = 50): Activity[] {
  const activity = getActivity();
  return activity
    .filter(a => a.accountId === accountId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getActivityForConnection(connectionId: string, limit = 100): Activity[] {
  const activity = getActivity();
  return activity
    .filter(a => a.connectionId === connectionId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function addActivity(data: Omit<Activity, 'id' | 'timestamp'>): Activity {
  const activityEntry: Activity = {
    ...data,
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  const activity = getActivity();
  activity.push(activityEntry);
  saveActivity(activity);
  return activityEntry;
}

export function updateActivity(id: string, data: Partial<Activity>): Activity | null {
  const activity = getActivity();
  const index = activity.findIndex(a => a.id === id);
  if (index === -1) return null;
  activity[index] = { ...activity[index], ...data };
  saveActivity(activity);
  return activity[index];
}

export function deleteActivity(id: string): boolean {
  const activity = getActivity();
  const initialLength = activity.length;
  const filtered = activity.filter(a => a.id !== id);
  if (filtered.length === initialLength) return false;
  saveActivity(filtered);
  console.log(`Deleted activity ${id}`);
  return true;
}

export function deleteActivities(ids: string[]): number {
  const activity = getActivity();
  const initialLength = activity.length;
  const filtered = activity.filter(a => !ids.includes(a.id));
  const deletedCount = initialLength - filtered.length;
  if (deletedCount > 0) {
    saveActivity(filtered);
    console.log(`Deleted ${deletedCount} activities`);
  }
  return deletedCount;
}
