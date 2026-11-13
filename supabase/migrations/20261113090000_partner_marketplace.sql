CREATE TABLE IF NOT EXISTS public.partner_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL,
  email text NOT NULL UNIQUE,
  whatsapp text NOT NULL,
  password_hash text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partner_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partner_accounts(id) ON DELETE CASCADE,
  game_slug text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  amount text NOT NULL,
  price integer NOT NULL CHECK (price > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_products_catalog_idx
  ON public.partner_products (game_slug, active, partner_id);

CREATE TABLE IF NOT EXISTS public.partner_orders (
  id text PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES public.partner_accounts(id),
  product_id uuid NOT NULL REFERENCES public.partner_products(id),
  game_slug text NOT NULL,
  product_name text NOT NULL,
  product_amount text NOT NULL,
  customer_identifier text NOT NULL,
  customer_email text NOT NULL,
  price integer NOT NULL CHECK (price > 0),
  platform_fee integer NOT NULL CHECK (platform_fee >= 0),
  partner_amount integer NOT NULL CHECK (partner_amount >= 0),
  status text NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment', 'paid', 'processing', 'completed', 'cancelled')),
  payout_status text NOT NULL DEFAULT 'unpaid'
    CHECK (payout_status IN ('unpaid', 'paid')),
  payout_reference text,
  paid_out_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (platform_fee + partner_amount = price)
);

CREATE INDEX IF NOT EXISTS partner_orders_partner_created_idx
  ON public.partner_orders (partner_id, created_at DESC);

ALTER TABLE public.partner_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_orders ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.partner_accounts FROM anon, authenticated;
REVOKE ALL ON public.partner_products FROM anon, authenticated;
REVOKE ALL ON public.partner_orders FROM anon, authenticated;

GRANT ALL ON public.partner_accounts TO service_role;
GRANT ALL ON public.partner_products TO service_role;
GRANT ALL ON public.partner_orders TO service_role;
