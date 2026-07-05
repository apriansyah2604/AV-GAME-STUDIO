import fs from 'fs';
import path from 'path';
import { randomUUID, createHash } from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONNECTIONS_FILE = path.join(DATA_DIR, 'connections.json');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'activity.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Helper to read file directly with backup
function readJsonFile(filePath: string) {
  ensureDataDir();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    // Try to recover from backup
    const backupPath = `${filePath}.bak`
    if (fs.existsSync(backupPath)) {
      try {
        console.log(`Recovering from backup: ${backupPath}`);
        const backupContent = fs.readFileSync(backupPath, 'utf-8');
        return JSON.parse(backupContent);
      } catch (backupError) {
        console.error(`Failed to recover from backup:`, backupError);
      }
    }
  }
  return [];
}

// Helper to write file directly with backup
function writeJsonFile(filePath: string, data: any) {
  ensureDataDir();
  
  // Create backup of existing file
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Hash password
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Verify password
function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
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

export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// Users operations
export function getUsers(): User[] {
  const rawUsers = readJsonFile(USERS_FILE);
  
  // Sanitize users
  let needsToSave = false;
  const sanitizedUsers = rawUsers.map((user: any, index: number) => {
    const existingId = user.id;
    const needsId = !existingId;
    const needsOtherFields = !user.username || !user.password || !user.role;
    
    if (needsId || needsOtherFields) {
      needsToSave = true;
    }
    
    return {
      id: existingId || randomUUID(),
      username: user.username || `user${index + 1}`,
      password: user.password || hashPassword('default'),
      email: user.email,
      role: user.role || 'user',
      createdAt: user.createdAt || new Date().toISOString(),
    };
  });
  
  // Initialize default admin user if no users exist
  if (sanitizedUsers.length === 0) {
    const defaultAdmin: User = {
      id: randomUUID(),
      username: 'admin',
      password: hashPassword('admin123'),
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    sanitizedUsers.push(defaultAdmin);
    needsToSave = true;
  }
  
  if (needsToSave) {
    saveUsers(sanitizedUsers);
  }
  
  return sanitizedUsers;
}

export function saveUsers(users: User[]): void {
  writeJsonFile(USERS_FILE, users);
}

export function getUserById(id: string): User | null {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export function getUserByUsername(username: string): User | null {
  const users = getUsers();
  return users.find(u => u.username === username) || null;
}

export function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  const user: User = {
    ...data,
    id: randomUUID(),
    password: hashPassword(data.password),
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  // Prevent overriding id and createdAt
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.createdAt;
  
  // If password is being updated, hash it
  if (sanitizedData.password) {
    sanitizedData.password = hashPassword(sanitizedData.password);
  }
  
  users[index] = { ...users[index], ...sanitizedData };
  saveUsers(users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  let users = getUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  
  if (users.length === initialLength) return false;
  saveUsers(users);
  return true;
}

export function loginUser(username: string, password: string): User | null {
  const user = getUserByUsername(username);
  if (!user) return null;
  
  if (verifyPassword(password, user.password)) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
}

// Connections operations
export function getConnections(): Connection[] {
  const rawConnections = readJsonFile(CONNECTIONS_FILE);
  
  // Sanitize connections to ensure all required fields exist
  let needsToSave = false;
  const sanitizedConnections = rawConnections.map((conn: any, index: number) => {
    const existingId = conn.id;
    const needsId = !existingId;
    const needsOtherFields = !conn.name || !conn.robloxUserId || !conn.authToken || !conn.status || !conn.lastConnected || !conn.createdAt;
    
    if (needsId || needsOtherFields) {
      needsToSave = true;
    }
    
    return {
      id: existingId || randomUUID(),
      name: conn.name || `Connection ${index + 1}`,
      robloxUserId: conn.robloxUserId || '',
      authToken: conn.authToken || '',
      status: conn.status || 'disconnected',
      lastConnected: conn.lastConnected || new Date().toISOString(),
      createdAt: conn.createdAt || new Date().toISOString(),
    };
  });
  
  if (needsToSave) {
    saveConnections(sanitizedConnections);
  }
  
  return sanitizedConnections;
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
    id: randomUUID(),
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
  
  // Prevent overriding id and createdAt
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.createdAt;
  
  connections[index] = { ...connections[index], ...sanitizedData };
  saveConnections(connections);
  return connections[index];
}

export function deleteConnection(id: string): boolean {
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
  
  return true;
}

// Accounts operations
export function getAccounts(): Account[] {
  const rawAccounts = readJsonFile(ACCOUNTS_FILE);
  
  // Sanitize accounts to ensure all required fields exist
  // BUT ONLY GENERATE NEW ID IF ACCOUNT DOESN'T HAVE ONE
  // AND NEVER CHANGE EXISTING IDs!
  let needsToSave = false;
  const sanitizedAccounts = rawAccounts.map((account: any, index: number) => {
    const existingId = account.id;
    const needsId = !existingId;
    const needsOtherFields = !account.username || !account.status || !account.lastActivity || !account.createdAt;
    
    if (needsId || needsOtherFields) {
      needsToSave = true;
    }

    const sanitized = {
      id: existingId || randomUUID(),
      connectionId: account.connectionId,
      username: account.username || `Account ${index + 1}`,
      password: account.password || '',
      status: account.status || 'ready',
      lastActivity: account.lastActivity || new Date().toISOString(),
      createdAt: account.createdAt || new Date().toISOString(),
    };
    return sanitized;
  });
  
  if (needsToSave) {
    saveAccounts(sanitizedAccounts);
  }
  
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
  const account: Account = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const rawAccounts = readJsonFile(ACCOUNTS_FILE);
  rawAccounts.push(account);
  writeJsonFile(ACCOUNTS_FILE, rawAccounts);
  return account;
}

export function updateAccount(id: string, data: Partial<Account>): Account | null {
  const accounts = getAccounts();
  const index = accounts.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  // Prevent overriding id and createdAt
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.createdAt;
  
  accounts[index] = { ...accounts[index], ...sanitizedData };
  saveAccounts(accounts);
  return accounts[index];
}

export function deleteAccount(id: string): boolean {
  const rawAccounts = readJsonFile(ACCOUNTS_FILE);
  const initialLength = rawAccounts.length;
  const remainingAccounts = rawAccounts.filter((a: any) => a.id !== id);

  if (remainingAccounts.length === initialLength) return false;
  
  writeJsonFile(ACCOUNTS_FILE, remainingAccounts);

  // Delete all associated activities
  const rawActivities = readJsonFile(ACTIVITY_FILE);
  const remainingActivities = rawActivities.filter((a: any) => a.accountId !== id);
  writeJsonFile(ACTIVITY_FILE, remainingActivities);

  return true;
}

export function deleteAccounts(ids: string[]): number {
  const idsSet = new Set(ids);
  const rawAccounts = readJsonFile(ACCOUNTS_FILE);
  const remainingAccounts = rawAccounts.filter((a: any) => !idsSet.has(a.id));
  const deletedCount = rawAccounts.length - remainingAccounts.length;

  if (deletedCount > 0) {
    writeJsonFile(ACCOUNTS_FILE, remainingAccounts);
    const rawActivities = readJsonFile(ACTIVITY_FILE);
    const remainingActivities = rawActivities.filter((a: any) => !idsSet.has(a.accountId));
    writeJsonFile(ACTIVITY_FILE, remainingActivities);
  }

  return deletedCount;
}

// Activity operations
export function getActivity(): Activity[] {
  const rawActivities = readJsonFile(ACTIVITY_FILE);
  
  // Sanitize activities
  let needsToSave = false;
  const sanitizedActivities = rawActivities.map((act: any, index: number) => {
    const existingId = act.id;
    const needsId = !existingId;
    const needsOtherFields = !act.accountId || !act.connectionId || !act.action || !act.status || !act.timestamp;
    
    if (needsId || needsOtherFields) {
      needsToSave = true;
    }
    
    return {
      id: existingId || randomUUID(),
      accountId: act.accountId || '',
      connectionId: act.connectionId || '',
      action: act.action || 'unknown',
      details: act.details || '',
      status: act.status || 'pending',
      timestamp: act.timestamp || new Date().toISOString(),
    };
  });
  
  if (needsToSave) {
    saveActivity(sanitizedActivities);
  }
  
  return sanitizedActivities;
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
    id: randomUUID(),
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
  
  // Prevent overriding id and timestamp
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.timestamp;
  
  activity[index] = { ...activity[index], ...sanitizedData };
  saveActivity(activity);
  return activity[index];
}

export function deleteActivity(id: string): boolean {
  const activity = getActivity();
  const initialLength = activity.length;
  const filtered = activity.filter(a => a.id !== id);
  if (filtered.length === initialLength) return false;
  saveActivity(filtered);
  return true;
}

export function deleteActivities(ids: string[]): number {
  const activity = getActivity();
  const initialLength = activity.length;
  const idsSet = new Set(ids);
  const filtered = activity.filter(a => !idsSet.has(a.id));
  const deletedCount = initialLength - filtered.length;
  if (deletedCount > 0) {
    saveActivity(filtered);
  }
  return deletedCount;
}
