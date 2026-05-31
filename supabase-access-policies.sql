-- Supabase RLS policies for AV GAME STUDIO content tables
-- Use this in SQL Editor after enabling RLS on each table.

-- Pricing policies
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_select_pricing ON public.pricing FOR SELECT USING (true);
CREATE POLICY allow_insert_pricing ON public.pricing FOR INSERT WITH CHECK (true);
CREATE POLICY allow_update_pricing ON public.pricing FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY allow_delete_pricing ON public.pricing FOR DELETE USING (true);

-- Assets policies
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_select_assets ON public.assets FOR SELECT USING (true);
CREATE POLICY allow_insert_assets ON public.assets FOR INSERT WITH CHECK (true);
CREATE POLICY allow_update_assets ON public.assets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY allow_delete_assets ON public.assets FOR DELETE USING (true);

-- Gallery policies
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_select_gallery ON public.gallery FOR SELECT USING (true);
CREATE POLICY allow_insert_gallery ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY allow_update_gallery ON public.gallery FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY allow_delete_gallery ON public.gallery FOR DELETE USING (true);

-- WARNING: These policies allow all access to anon/public keys.
-- This is acceptable for local testing or trusted backend-only environments,
-- but should be tightened for production use.
