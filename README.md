# AV-GAME-STUDIO

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_tvQDhNdiQEjcyeAP814RiSKGSnzh)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Partner game stores

1. Copy `.env.example` to `.env.local` and configure Supabase, `SUPABASE_SERVICE_ROLE_KEY`, `AUTH_SECRET`, the Roblox OAuth values, and Midtrans keys. Keep the Supabase service-role key server-only; never prefix it with `NEXT_PUBLIC_`.
2. Run `supabase/migrations/20261113090000_partner_marketplace.sql` in the Supabase SQL Editor.
3. [Register a Roblox OAuth app](https://create.roblox.com/docs/cloud/auth/oauth2-registration) with the `openid` and `profile` scopes and add `http://localhost:3000/api/auth/callback/roblox` as a local redirect URL (and your production callback URL when deploying). Configure `AUTH_ROBLOX_ALLOWED_USER_IDS` with authorized Roblox IDs and `AUTH_ROBLOX_ADMIN_USER_ID` with the existing admin row's `users.id` in Supabase to preserve dashboard data ownership.
4. Sign in with Roblox at `/login`, then review applications and partner payout records at `/admin/partners`.
5. Partners register at `/partner/register`. Approved partners manage packages and paid orders at `/partner/dashboard`.

Partner checkout charges 5% platform commission and records 95% for the partner. Payment is received by the platform Midtrans account; partners fulfill orders manually, and an admin records payout only after transferring the partner share.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/apriansyah2604/AV-GAME-STUDIO" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
