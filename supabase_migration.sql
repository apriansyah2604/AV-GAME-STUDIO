-- Supabase Migration for AV Game Studio
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new

-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Connections
CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  roblox_user_id TEXT NOT NULL,
  auth_token TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  last_connected TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Accounts
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  status TEXT DEFAULT 'ready',
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Activity
CREATE TABLE IF NOT EXISTS activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  details TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) untuk keamanan
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS: User hanya bisa melihat/mengedit data mereka sendiri
-- Catatan: Untuk autentikasi, kita menggunakan server-side, jadi kita perlu kebijakan yang mengizinkan akses full untuk service role
-- Atau, jika menggunakan Supabase Auth, kita bisa menyesuaikan kebijakan
-- Untuk sekarang, kita buat kebijakan yang mengizinkan akses full (untuk development)
-- Nanti bisa disesuaikan untuk production

-- Kebijakan untuk Users
CREATE POLICY "Enable read for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON users FOR DELETE USING (true);

-- Kebijakan untuk Connections
CREATE POLICY "Enable all for connections" ON connections FOR ALL USING (true);

-- Kebijakan untuk Accounts
CREATE POLICY "Enable all for accounts" ON accounts FOR ALL USING (true);

-- Kebijakan untuk Activity
CREATE POLICY "Enable all for activity" ON activity FOR ALL USING (true);
