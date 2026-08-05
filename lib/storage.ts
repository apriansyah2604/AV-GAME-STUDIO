import { randomUUID } from 'crypto';
import { hashPassword, verifyPassword, normalizeOwnerUserId, getSeedAdminCredentials } from './authUtils';
import { supabase } from './supabase';

// Helper to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Helper to convert camelCase to snake_case
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Helper to convert object keys from snake_case to camelCase
function convertToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertToCamelCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = convertToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Helper to convert object keys from camelCase to snake_case
function convertToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertToSnakeCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = convertToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Type definitions
export interface Connection {
  id: string;
  ownerUserId?: string;
  name: string;
  robloxUserId: string;
  authToken: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected: string;
  createdAt: string;
}

export interface Account {
  id: string;
  ownerUserId?: string;
  connectionId: string;
  username: string;
  password: string;
  status: 'ready' | 'working' | 'error';
  lastActivity: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  ownerUserId?: string;
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
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  const users = convertToCamelCase(data) as User[];
  
  // Initialize default admin user if no users exist
  if (users.length === 0) {
    const seedAdmin = getSeedAdminCredentials();
    if (seedAdmin) {
      const defaultAdmin: User = {
        id: randomUUID(),
        username: seedAdmin.username,
        password: hashPassword(seedAdmin.password),
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      await createUser(defaultAdmin);
      return [defaultAdmin];
    }
  }
  
  return users;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error || !data) {
    console.error('Error fetching user:', error);
    return null;
  }
  return convertToCamelCase(data) as User;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
  if (error || !data) {
    console.error('Error fetching user by username:', error);
    return null;
  }
  return convertToCamelCase(data) as User;
}

export async function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const user: User = {
    ...data,
    id: data.id || randomUUID(),
    password: hashPassword(data.password),
    createdAt: new Date().toISOString(),
  };
  console.log('[storage.createUser] Creating user:', user);
  
  const { error } = await supabase.from('users').insert(convertToSnakeCase(user));
  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  
  console.log('[storage.createUser] User created');
  return user;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  // Prevent overriding id and createdAt
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.createdAt;
  
  // If password is being updated, hash it
  if (sanitizedData.password) {
    sanitizedData.password = hashPassword(sanitizedData.password);
  }
  
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(convertToSnakeCase(sanitizedData))
    .eq('id', id)
    .select()
    .single();
    
  if (error || !updatedUser) {
    console.error('Error updating user:', error);
    return null;
  }
  
  return convertToCamelCase(updatedUser) as User;
}

export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }
  return true;
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;
  
  if (verifyPassword(password, user.password)) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
}

// Connections operations
export async function getConnections(): Promise<Connection[]> {
  const { data, error } = await supabase.from('connections').select('*');
  if (error) {
    console.error('Error fetching connections:', error);
    return [];
  }
  return convertToCamelCase(data) as Connection[];
}

export async function getConnectionsByOwner(ownerUserId: string): Promise<Connection[]> {
  const normalizedOwnerUserId = normalizeOwnerUserId(ownerUserId);
  if (!normalizedOwnerUserId) {
    return [];
  }

  const { data, error } = await supabase.from('connections').select('*').eq('owner_user_id', normalizedOwnerUserId);
  if (error) {
    console.error('Error fetching connections by owner:', error);
    return [];
  }
  return convertToCamelCase(data) as Connection[];
}

export async function getConnection(id: string, ownerUserId?: string): Promise<Connection | null> {
  let query = supabase.from('connections').select('*').eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data, error } = await query.single();
  if (error || !data) {
    console.error('Error fetching connection:', error);
    return null;
  }
  return convertToCamelCase(data) as Connection;
}

export async function createConnection(data: Omit<Connection, 'id' | 'createdAt'>): Promise<Connection> {
  console.log('[storage.createConnection] Creating connection:', data);
  const connection: Connection = {
    ...data,
    ownerUserId: normalizeOwnerUserId(data.ownerUserId),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  const { error } = await supabase.from('connections').insert(convertToSnakeCase(connection));
  if (error) {
    console.error('Error creating connection:', error);
    throw error;
  }
  
  console.log('[storage.createConnection] Connection created');
  return connection;
}

export async function updateConnection(id: string, data: Partial<Connection>, ownerUserId?: string): Promise<Connection | null> {
  // Prevent overriding id and createdAt
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.createdAt;
  delete sanitizedData.ownerUserId;
  
  let query = supabase.from('connections').update(convertToSnakeCase(sanitizedData)).eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data: updatedConnection, error } = await query.select().single();
  if (error || !updatedConnection) {
    console.error('Error updating connection:', error);
    return null;
  }
  
  return convertToCamelCase(updatedConnection) as Connection;
}

export async function deleteConnection(id: string, ownerUserId?: string): Promise<boolean> {
  let query = supabase.from('connections').delete().eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { error } = await query;
  if (error) {
    console.error('Error deleting connection:', error);
    return false;
  }
  
  // Supabase handles cascading deletes via foreign keys, so we don't need to manually delete accounts/activities
  return true;
}

// Accounts operations
export async function getAccounts(): Promise<Account[]> {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
  return convertToCamelCase(data) as Account[];
}

export async function getAccountsByOwner(ownerUserId: string): Promise<Account[]> {
  const normalizedOwnerUserId = normalizeOwnerUserId(ownerUserId);
  if (!normalizedOwnerUserId) {
    return [];
  }

  const { data, error } = await supabase.from('accounts').select('*').eq('owner_user_id', normalizedOwnerUserId);
  if (error) {
    console.error('Error fetching accounts by owner:', error);
    return [];
  }
  return convertToCamelCase(data) as Account[];
}

export async function getAccountsByConnection(connectionId: string, ownerUserId?: string): Promise<Account[]> {
  let query = supabase.from('accounts').select('*').eq('connection_id', connectionId);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching accounts by connection:', error);
    return [];
  }
  return convertToCamelCase(data) as Account[];
}

export async function getAccount(id: string, ownerUserId?: string): Promise<Account | null> {
  let query = supabase.from('accounts').select('*').eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data, error } = await query.single();
  if (error || !data) {
    console.error('Error fetching account:', error);
    return null;
  }
  return convertToCamelCase(data) as Account;
}

export async function createAccount(data: Omit<Account, 'id' | 'createdAt'>): Promise<Account> {
  // Verify connection exists and belongs to the owner
  const connection = await getConnection(data.connectionId, data.ownerUserId);
  if (!connection) {
    throw new Error('Connection not found or you don\'t have permission to use it');
  }

  const account: Account = {
    ...data,
    ownerUserId: normalizeOwnerUserId(data.ownerUserId),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  const { error } = await supabase.from('accounts').insert(convertToSnakeCase(account));
  if (error) {
    console.error('Error creating account:', error);
    throw error;
  }
  
  return account;
}

export async function updateAccount(id: string, data: Partial<Account>, ownerUserId?: string): Promise<Account | null> {
  // Prevent overriding id and createdAt
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.createdAt;
  delete sanitizedData.ownerUserId;
  
  let query = supabase.from('accounts').update(convertToSnakeCase(sanitizedData)).eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data: updatedAccount, error } = await query.select().single();
  if (error || !updatedAccount) {
    console.error('Error updating account:', error);
    return null;
  }
  
  return convertToCamelCase(updatedAccount) as Account;
}

export async function deleteAccount(id: string, ownerUserId?: string): Promise<boolean> {
  let query = supabase.from('accounts').delete().eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { error } = await query;
  if (error) {
    console.error('Error deleting account:', error);
    return false;
  }
  return true;
}

export async function deleteAccounts(ids: string[], ownerUserId?: string): Promise<number> {
  let query = supabase.from('accounts').delete().in('id', ids);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { error, count } = await query.select('count', { count: 'exact' });
  if (error) {
    console.error('Error deleting accounts:', error);
    return 0;
  }
  
  return count || 0;
}

// Activity operations
export async function getActivity(): Promise<Activity[]> {
  const { data, error } = await supabase.from('activity').select('*');
  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
  return convertToCamelCase(data) as Activity[];
}

export async function getActivityByOwner(ownerUserId: string): Promise<Activity[]> {
  const normalizedOwnerUserId = normalizeOwnerUserId(ownerUserId);
  if (!normalizedOwnerUserId) {
    return [];
  }

  const { data, error } = await supabase.from('activity').select('*').eq('owner_user_id', normalizedOwnerUserId);
  if (error) {
    console.error('Error fetching activity by owner:', error);
    return [];
  }
  return convertToCamelCase(data) as Activity[];
}

export async function getActivityForAccount(accountId: string, limit = 50, ownerUserId?: string): Promise<Activity[]> {
  let query = supabase.from('activity').select('*').eq('account_id', accountId).order('timestamp', { ascending: false }).limit(limit);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching activity for account:', error);
    return [];
  }
  return convertToCamelCase(data) as Activity[];
}

export async function getActivityForConnection(connectionId: string, limit = 100, ownerUserId?: string): Promise<Activity[]> {
  let query = supabase.from('activity').select('*').eq('connection_id', connectionId).order('timestamp', { ascending: false }).limit(limit);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching activity for connection:', error);
    return [];
  }
  return convertToCamelCase(data) as Activity[];
}

export async function addActivity(data: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
  const relatedAccount = await getAccount(data.accountId);
  const relatedConnection = await getConnection(data.connectionId);
  const activityEntry: Activity = {
    ...data,
    ownerUserId:
      normalizeOwnerUserId(data.ownerUserId) ||
      relatedAccount?.ownerUserId ||
      relatedConnection?.ownerUserId,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
  };
  
  const { error } = await supabase.from('activity').insert(convertToSnakeCase(activityEntry));
  if (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
  
  return activityEntry;
}

export async function updateActivity(id: string, data: Partial<Activity>, ownerUserId?: string): Promise<Activity | null> {
  // Prevent overriding id and timestamp
  const sanitizedData = { ...data };
  delete sanitizedData.id;
  delete sanitizedData.timestamp;
  delete sanitizedData.ownerUserId;
  
  let query = supabase.from('activity').update(convertToSnakeCase(sanitizedData)).eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { data: updatedActivity, error } = await query.select().single();
  if (error || !updatedActivity) {
    console.error('Error updating activity:', error);
    return null;
  }
  
  return convertToCamelCase(updatedActivity) as Activity;
}

export async function deleteActivity(id: string, ownerUserId?: string): Promise<boolean> {
  let query = supabase.from('activity').delete().eq('id', id);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { error } = await query;
  if (error) {
    console.error('Error deleting activity:', error);
    return false;
  }
  return true;
}

export async function deleteActivities(ids: string[], ownerUserId?: string): Promise<number> {
  let query = supabase.from('activity').delete().in('id', ids);
  if (ownerUserId) {
    query = query.eq('owner_user_id', ownerUserId);
  }
  
  const { error, count } = await query.select('count', { count: 'exact' });
  if (error) {
    console.error('Error deleting activities:', error);
    return 0;
  }
  
  return count || 0;
}
