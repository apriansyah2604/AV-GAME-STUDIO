-- Fix for existing Supabase projects where public.pricing was created
-- before the current admin catalog fields existed.

ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS price text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS meta text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS stock text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.pricing ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

NOTIFY pgrst, 'reload schema';
