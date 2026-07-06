import { supabase } from './supabase'
import { randomUUID } from 'crypto'
import { hashPassword, verifyPassword, normalizeOwnerUserId, getSeedAdminCredentials } from './authUtils'

// Type definitions matching our original storage.ts
export interface Connection {
  id: string
  ownerUserId?: string
  name: string
  robloxUserId: string
  authToken: string
  status: 'connected' | 'disconnected' | 'error'
  lastConnected: string
  createdAt: string
}

export interface Account {
  id: string
  ownerUserId?: string
  connectionId: string
  username: string
  password: string
  status: 'ready' | 'working' | 'error'
  lastActivity: string
  createdAt: string
}

export interface Activity {
  id: string
  ownerUserId?: string
  accountId: string
  connectionId: string
  action: string
  details: string
  status: 'pending' | 'success' | 'failed'
  timestamp: string
}

export interface User {
  id: string
  username: string
  password: string
  email?: string
  role: 'admin' | 'user'
  createdAt: string
}

// ============================================
// USERS OPERATIONS
// ============================================

export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    
    let users = data.map(user => ({
      ...user,
      created_at: user.created_at || new Date().toISOString(),
    })) as User[]
    
    // Seed admin user if none exists
    const needsAdminSeed = users.length === 0
    if (needsAdminSeed) {
      const seedCredentials = getSeedAdminCredentials()
      if (seedCredentials) {
        try {
          const adminUser = await createUser({
            username: seedCredentials.username,
            password: seedCredentials.password,
            role: 'admin'
          })
          users = [adminUser]
        } catch (seedError) {
          console.error('Error seeding admin user:', seedError)
        }
      }
    }
    
    return users
  } catch (error) {
    console.error('Error in getUsers:', error)
    return []
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data ? {
    ...data,
    created_at: data.created_at || new Date().toISOString(),
  } as User : null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('username', username).single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data ? {
    ...data,
    created_at: data.created_at || new Date().toISOString(),
  } as User : null
}

export async function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const user: User = {
    ...data,
    id: randomUUID(),
    password: hashPassword(data.password),
    createdAt: new Date().toISOString(),
  }
  
  const { data: result, error } = await supabase.from('users').insert([{
    id: user.id,
    username: user.username,
    password: user.password,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
  }]).select().single()
  
  if (error) throw error
  return result as User
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const updateData: any = {}
  if (data.username) updateData.username = data.username
  if (data.password) updateData.password = hashPassword(data.password)
  if (data.email) updateData.email = data.email
  if (data.role) updateData.role = data.role

  const { data: result, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return result as User
}

export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', id)
  return !error
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username)
  if (!user) return null
  
  if (verifyPassword(password, user.password)) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }
  
  return null
}

// ============================================
// CONNECTIONS OPERATIONS
// ============================================

export async function getConnections(): Promise<Connection[]> {
  const { data, error } = await supabase.from('connections').select('*')
  if (error) throw error
  return data.map(conn => ({
    ...conn,
    ownerUserId: conn.owner_user_id,
    robloxUserId: conn.roblox_user_id,
    lastConnected: conn.last_connected || new Date().toISOString(),
    createdAt: conn.created_at || new Date().toISOString(),
  })) as Connection[]
}

export async function getConnectionsByOwner(ownerUserId: string): Promise<Connection[]> {
  const normalizedOwnerUserId = normalizeOwnerUserId(ownerUserId)
  if (!normalizedOwnerUserId) return []

  const { data, error } = await supabase.from('connections').select('*').eq('owner_user_id', normalizedOwnerUserId)
  if (error) throw error
  
  return data.map(conn => ({
    ...conn,
    ownerUserId: conn.owner_user_id,
    robloxUserId: conn.roblox_user_id,
    lastConnected: conn.last_connected || new Date().toISOString(),
    createdAt: conn.created_at || new Date().toISOString(),
  })) as Connection[]
}

export async function getConnection(id: string, ownerUserId?: string): Promise<Connection | null> {
  let query = supabase.from('connections').select('*').eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data, error } = await query.single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  
  return data ? {
    ...data,
    ownerUserId: data.owner_user_id,
    robloxUserId: data.roblox_user_id,
    lastConnected: data.last_connected || new Date().toISOString(),
    createdAt: data.created_at || new Date().toISOString(),
  } as Connection : null
}

export async function createConnection(data: Omit<Connection, 'id' | 'createdAt'>): Promise<Connection> {
  const connection: Connection = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  }
  
  const { data: result, error } = await supabase.from('connections').insert([{
    id: connection.id,
    owner_user_id: normalizeOwnerUserId(connection.ownerUserId),
    name: connection.name,
    roblox_user_id: connection.robloxUserId,
    auth_token: connection.authToken,
    status: connection.status,
    last_connected: connection.lastConnected,
    created_at: connection.createdAt,
  }]).select().single()
  
  if (error) throw error
  
  return {
    ...result,
    ownerUserId: result.owner_user_id,
    robloxUserId: result.roblox_user_id,
    lastConnected: result.last_connected,
    createdAt: result.created_at,
  } as Connection
}

export async function updateConnection(id: string, data: Partial<Connection>, ownerUserId?: string): Promise<Connection | null> {
  const updateData: any = {}
  if (data.name) updateData.name = data.name
  if (data.robloxUserId) updateData.roblox_user_id = data.robloxUserId
  if (data.authToken) updateData.auth_token = data.authToken
  if (data.status) updateData.status = data.status
  if (data.lastConnected) updateData.last_connected = data.lastConnected

  let query = supabase.from('connections').update(updateData).eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data: result, error } = await query.select().single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  
  return {
    ...result,
    ownerUserId: result.owner_user_id,
    robloxUserId: result.roblox_user_id,
    lastConnected: result.last_connected,
    createdAt: result.created_at,
  } as Connection
}

export async function deleteConnection(id: string, ownerUserId?: string): Promise<boolean> {
  let query = supabase.from('connections').delete().eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { error } = await query
  return !error
}

// ============================================
// ACCOUNTS OPERATIONS
// ============================================

export async function getAccounts(): Promise<Account[]> {
  const { data, error } = await supabase.from('accounts').select('*')
  if (error) throw error
  return data.map(acc => ({
    ...acc,
    ownerUserId: acc.owner_user_id,
    connectionId: acc.connection_id,
    lastActivity: acc.last_activity || new Date().toISOString(),
    createdAt: acc.created_at || new Date().toISOString(),
  })) as Account[]
}

export async function getAccountsByOwner(ownerUserId: string): Promise<Account[]> {
  const normalizedOwnerUserId = normalizeOwnerUserId(ownerUserId)
  if (!normalizedOwnerUserId) return []

  const { data, error } = await supabase.from('accounts').select('*').eq('owner_user_id', normalizedOwnerUserId)
  if (error) throw error
  
  return data.map(acc => ({
    ...acc,
    ownerUserId: acc.owner_user_id,
    connectionId: acc.connection_id,
    lastActivity: acc.last_activity || new Date().toISOString(),
    createdAt: acc.created_at || new Date().toISOString(),
  })) as Account[]
}

export async function getAccount(id: string, ownerUserId?: string): Promise<Account | null> {
  let query = supabase.from('accounts').select('*').eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data, error } = await query.single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  
  return data ? {
    ...data,
    ownerUserId: data.owner_user_id,
    connectionId: data.connection_id,
    lastActivity: data.last_activity || new Date().toISOString(),
    createdAt: data.created_at || new Date().toISOString(),
  } as Account : null
}

export async function getAccountsByConnection(connectionId: string, ownerUserId?: string): Promise<Account[]> {
  let query = supabase.from('accounts').select('*').eq('connection_id', connectionId)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data, error } = await query
  if (error) throw error
  
  return data.map(acc => ({
    ...acc,
    ownerUserId: acc.owner_user_id,
    connectionId: acc.connection_id,
    lastActivity: acc.last_activity || new Date().toISOString(),
    createdAt: acc.created_at || new Date().toISOString(),
  })) as Account[]
}

export async function createAccount(data: Omit<Account, 'id' | 'createdAt'>): Promise<Account> {
  // Verify connection exists and belongs to the owner
  const connection = await getConnection(data.connectionId, data.ownerUserId)
  if (!connection) {
    throw new Error('Connection not found or you don\'t have permission to use it')
  }

  const account: Account = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  }
  
  const { data: result, error } = await supabase.from('accounts').insert([{
    id: account.id,
    owner_user_id: normalizeOwnerUserId(account.ownerUserId),
    connection_id: account.connectionId,
    username: account.username,
    password: account.password,
    status: account.status,
    last_activity: account.lastActivity,
    created_at: account.createdAt,
  }]).select().single()
  
  if (error) throw error
  
  return {
    ...result,
    ownerUserId: result.owner_user_id,
    connectionId: result.connection_id,
    lastActivity: result.last_activity,
    createdAt: result.created_at,
  } as Account
}

export async function updateAccount(id: string, data: Partial<Account>, ownerUserId?: string): Promise<Account | null> {
  const updateData: any = {}
  if (data.username) updateData.username = data.username
  if (data.password) updateData.password = data.password
  if (data.status) updateData.status = data.status
  if (data.lastActivity) updateData.last_activity = data.lastActivity

  let query = supabase.from('accounts').update(updateData).eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data: result, error } = await query.select().single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  
  return {
    ...result,
    ownerUserId: result.owner_user_id,
    connectionId: result.connection_id,
    lastActivity: result.last_activity,
    createdAt: result.created_at,
  } as Account
}

export async function deleteAccount(id: string, ownerUserId?: string): Promise<boolean> {
  let query = supabase.from('accounts').delete().eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { error } = await query
  return !error
}

export async function deleteAccounts(ids: string[], ownerUserId?: string): Promise<number> {
  let query = supabase.from('accounts').delete().in('id', ids)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { error, count } = await query.select('count', { count: 'exact' })
  return !error ? count || 0 : 0
}

// ============================================
// ACTIVITY OPERATIONS
// ============================================

export async function getActivity(): Promise<Activity[]> {
  const { data, error } = await supabase.from('activity').select('*').order('timestamp', { ascending: false })
  if (error) throw error
  return data as Activity[]
}

export async function getActivityByOwner(ownerUserId: string): Promise<Activity[]> {
  const normalizedOwnerUserId = normalizeOwnerUserId(ownerUserId)
  if (!normalizedOwnerUserId) return []

  const { data, error } = await supabase.from('activity').select('*').eq('owner_user_id', normalizedOwnerUserId).order('timestamp', { ascending: false })
  if (error) throw error
  
  return data.map(act => ({
    ...act,
    ownerUserId: act.owner_user_id,
    accountId: act.account_id,
    connectionId: act.connection_id,
  })) as Activity[]
}

export async function getActivityForAccount(accountId: string, limit = 50, ownerUserId?: string): Promise<Activity[]> {
  let query = supabase.from('activity').select('*').eq('account_id', accountId).order('timestamp', { ascending: false }).limit(limit)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data, error } = await query
  if (error) throw error
  
  return data.map(act => ({
    ...act,
    ownerUserId: act.owner_user_id,
    accountId: act.account_id,
    connectionId: act.connection_id,
  })) as Activity[]
}

export async function getActivityForConnection(connectionId: string, limit = 100, ownerUserId?: string): Promise<Activity[]> {
  let query = supabase.from('activity').select('*').eq('connection_id', connectionId).order('timestamp', { ascending: false }).limit(limit)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data, error } = await query
  if (error) throw error
  
  return data.map(act => ({
    ...act,
    ownerUserId: act.owner_user_id,
    accountId: act.account_id,
    connectionId: act.connection_id,
  })) as Activity[]
}

export async function addActivity(data: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
  const activity: Activity = {
    ...data,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
  }
  
  const { data: result, error } = await supabase.from('activity').insert([{
    id: activity.id,
    owner_user_id: normalizeOwnerUserId(activity.ownerUserId),
    account_id: activity.accountId,
    connection_id: activity.connectionId,
    action: activity.action,
    details: activity.details,
    status: activity.status,
    timestamp: activity.timestamp,
  }]).select().single()
  
  if (error) throw error
  
  return {
    ...result,
    ownerUserId: result.owner_user_id,
    accountId: result.account_id,
    connectionId: result.connection_id,
  } as Activity
}

export async function updateActivity(id: string, data: Partial<Activity>, ownerUserId?: string): Promise<Activity | null> {
  const updateData: any = {}
  if (data.action) updateData.action = data.action
  if (data.details) updateData.details = data.details
  if (data.status) updateData.status = data.status

  let query = supabase.from('activity').update(updateData).eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { data: result, error } = await query.select().single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  
  return {
    ...result,
    ownerUserId: result.owner_user_id,
    accountId: result.account_id,
    connectionId: result.connection_id,
  } as Activity
}

export async function deleteActivity(id: string, ownerUserId?: string): Promise<boolean> {
  let query = supabase.from('activity').delete().eq('id', id)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { error } = await query
  return !error
}

export async function deleteActivities(ids: string[], ownerUserId?: string): Promise<number> {
  let query = supabase.from('activity').delete().in('id', ids)
  if (ownerUserId) query = query.eq('owner_user_id', ownerUserId)
  
  const { error, count } = await query.select('count', { count: 'exact' })
  return !error ? count || 0 : 0
}
