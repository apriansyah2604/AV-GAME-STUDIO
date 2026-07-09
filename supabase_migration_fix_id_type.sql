-- Migrasi untuk mengubah tipe kolom UUID menjadi TEXT (untuk mendukung Google Auth)
-- Perintah ini aman jika Anda belum punya data, atau ingin menghapus data lama untuk mulai baru
-- Jika Anda punya data penting, backup terlebih dahulu!

-- Hapus tabel lama (dengan UUID) dan buat baru (dengan TEXT)
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Buat Tabel Users (id TEXT)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buat Tabel Connections (id TEXT, owner_user_id TEXT)
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  roblox_user_id TEXT NOT NULL,
  auth_token TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  last_connected TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buat Tabel Accounts
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  connection_id TEXT REFERENCES connections(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  status TEXT DEFAULT 'ready',
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buat Tabel Activity
CREATE TABLE activity (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  connection_id TEXT REFERENCES connections(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  details TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

-- Buat Kebijakan RLS
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for connections" ON connections FOR ALL USING (true);
CREATE POLICY "Enable all access for accounts" ON accounts FOR ALL USING (true);
CREATE POLICY "Enable all access for activity" ON activity FOR ALL USING (true);
