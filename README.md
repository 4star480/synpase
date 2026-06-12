# Synpase GameShop

A player-to-player gaming marketplace: buy and sell game accounts, in-game currency, items, and boosting services. Built with Next.js (App Router), Tailwind CSS, Prisma, and SQLite.

## Features

- Browse and search 3,200+ listings across 30 games with live autocomplete
- Category filters: accounts, currency, items, boosting
- Listing detail pages with seller ratings, reviews, and wishlist
- Seller profiles with sales stats, active offers, and review history
- Live purchase ticker and community reviews carousel
- Email/password authentication with JWT cookie sessions
- Secure checkout with crypto and gift card payments
- Wishlist saved in browser localStorage

## Getting started

```bash
npm install
npm run db:reset   # prisma db push + seed
npm run dev
```

Open http://localhost:3000.

Copy the environment template and start PostgreSQL:

```bash
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
docker compose up -d
npm run db:deploy
```

### Admin panel

Open **http://localhost:3000/admin/login** after seeding. Credentials are printed when you run `npm run db:seed`.

For production deployment (Vercel, Railway, VPS), see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Payments

- **Crypto:** configure `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET` for live invoicing
- **Gift cards:** Amazon, Steam, PlayStation, Xbox, Nintendo, Google Play, Apple, Roblox, and more — issued via admin panel

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run dev:lan` | Dev server on all interfaces (phone testing) |
| `npm run build` | Production build |
| `npm run db:push` | Apply schema |
| `npm run db:seed` | Seed database |
| `npm run db:reset` | Push schema + seed |
