-- Supabase RLS policies for AV GAME STUDIO content tables
-- Use this in SQL Editor after enabling RLS on each table.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;

-- Pricing policies
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_pricing ON public.pricing;
DROP POLICY IF EXISTS allow_insert_pricing ON public.pricing;
DROP POLICY IF EXISTS allow_update_pricing ON public.pricing;
DROP POLICY IF EXISTS allow_delete_pricing ON public.pricing;
CREATE POLICY allow_select_pricing ON public.pricing FOR SELECT USING (true);
CREATE POLICY allow_insert_pricing ON public.pricing FOR INSERT WITH CHECK (true);
CREATE POLICY allow_update_pricing ON public.pricing FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY allow_delete_pricing ON public.pricing FOR DELETE USING (true);

-- Assets policies
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_assets ON public.assets;
DROP POLICY IF EXISTS allow_insert_assets ON public.assets;
DROP POLICY IF EXISTS allow_update_assets ON public.assets;
DROP POLICY IF EXISTS allow_delete_assets ON public.assets;
CREATE POLICY allow_select_assets ON public.assets FOR SELECT USING (true);
CREATE POLICY allow_insert_assets ON public.assets FOR INSERT WITH CHECK (true);
CREATE POLICY allow_update_assets ON public.assets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY allow_delete_assets ON public.assets FOR DELETE USING (true);

-- Gallery policies
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_gallery ON public.gallery;
DROP POLICY IF EXISTS allow_insert_gallery ON public.gallery;
DROP POLICY IF EXISTS allow_update_gallery ON public.gallery;
DROP POLICY IF EXISTS allow_delete_gallery ON public.gallery;
CREATE POLICY allow_select_gallery ON public.gallery FOR SELECT USING (true);
CREATE POLICY allow_insert_gallery ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY allow_update_gallery ON public.gallery FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY allow_delete_gallery ON public.gallery FOR DELETE USING (true);

-- Orders policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_orders ON public.orders;
DROP POLICY IF EXISTS allow_insert_orders ON public.orders;
DROP POLICY IF EXISTS allow_update_orders ON public.orders;
DROP POLICY IF EXISTS allow_delete_orders ON public.orders;
CREATE POLICY allow_select_orders ON public.orders FOR SELECT USING (true);
CREATE POLICY allow_insert_orders ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY allow_update_orders ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY allow_delete_orders ON public.orders FOR DELETE USING (true);

-- WARNING: These policies allow all access to anon/public keys.
-- This is acceptable for local testing or trusted backend-only environments,
-- but should be tightened for production use.
