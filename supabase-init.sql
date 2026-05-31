-- Supabase table creation script for AV GAME STUDIO
-- Run this first in SQL Editor before applying access policies.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text,
  badge text,
  meta text,
  stock text,
  featured boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Keep older existing tables compatible with the current admin payload.
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS price text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS meta text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS stock text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price text,
  badge text,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  src text,
  category text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY,
  username text NOT NULL,
  package text NOT NULL,
  price integer,
  status text DEFAULT 'pending',
  proof text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS package text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price integer;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS proof text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
