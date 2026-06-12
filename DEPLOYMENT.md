# Deployment guide

## Admin panel

The admin UI is **not linked** from the public storefront (by design).

| | |
|--|--|
| **URL** | `https://YOUR-DOMAIN.com/admin/login` |
| **Dashboard** | `https://YOUR-DOMAIN.com/admin` |

After the database is seeded, sign in with:

- **Email:** `admin@synpase.com`
- **Password:** value from `ADMIN_PASSWORD` when you ran seed (default `admin123456` if unset)

Change the password immediately on a live site by updating the user in the database or re-seeding with a strong `ADMIN_PASSWORD`.

---

## Required environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `SESSION_SECRET` | Yes (prod) | Random string, **at least 32 characters** |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Public URL, e.g. `https://yourdomain.com` |
| `ADMIN_PASSWORD` | Recommended | Admin password used when seeding (run once) |
| `SKIP_IMAGE_DOWNLOAD` | Optional | Set `1` on deploy seed to skip slow image downloads |
| `NOWPAYMENTS_API_KEY` | Optional | Live crypto payments |
| `NOWPAYMENTS_IPN_SECRET` | Optional | Crypto webhook secret |
| `ALLOW_CRYPTO_SIMULATE` | Optional | Set `0` in production when using live crypto |

Copy `.env.example` and fill in values before building.

---

## Netlify (recommended)

SQLite **does not work** on Netlify. Use **PostgreSQL** (free tier from [Neon](https://neon.tech)).

### 1. Netlify environment variables

In **Site configuration → Environment variables**, add:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `SESSION_SECRET` | 32+ random characters |
| `NEXT_PUBLIC_SITE_URL` | `https://stoned-pasca-8ede74.netlify.app` |

### 2. Seed the production database (once)

From your PC, with the Neon connection string:

```bash
DATABASE_URL="postgresql://..." ADMIN_PASSWORD="YourStrongPassword" npm run db:deploy
```

### 3. Redeploy

Trigger **Deploys → Trigger deploy → Clear cache and deploy site**.

Admin panel: `https://YOUR-SITE.netlify.app/admin/login`

---

## Database

This project uses **PostgreSQL** (`prisma/schema.prisma`).

Local Postgres via Docker:

```bash
docker compose up -d
# DATABASE_URL="postgresql://gametrade:gametrade@localhost:5432/gametrade"
npm run db:deploy
```

---

## First-time production setup

Run **once** against your production database (not on every deploy):

```bash
npm install
npx prisma db push
SKIP_IMAGE_DOWNLOAD=1 ADMIN_PASSWORD="your-strong-password" npm run db:seed
```

Or use the shortcut:

```bash
ADMIN_PASSWORD="your-strong-password" npm run db:deploy
```

This creates games, listings, gift cards, and the admin account.

---

## Vercel

1. Import the GitHub repo.
2. Add environment variables in **Project → Settings → Environment Variables**.
3. Use **PostgreSQL** (Neon integration recommended).
4. Build command (default from `vercel.json`): `prisma generate && next build`
5. After first deploy, run seed from your machine against the production `DATABASE_URL`:
   ```bash
   DATABASE_URL="postgresql://..." ADMIN_PASSWORD="..." SKIP_IMAGE_DOWNLOAD=1 npm run db:seed
   ```
6. Open `https://your-app.vercel.app/admin/login`

---

## Railway / Render / VPS

1. Set env vars above.
2. Use SQLite with a mounted volume **or** attach PostgreSQL.
3. Build: `npm run build`
4. Start: `npm run start`
5. Run `npm run db:deploy` once after the database is available.

For Docker standalone output:

```bash
npm run build
node .next/standalone/server.js
```

---

## Production checklist

- [ ] `SESSION_SECRET` is 32+ random characters
- [ ] `NEXT_PUBLIC_SITE_URL` matches your live domain
- [ ] Database seeded with admin account
- [ ] `ALLOW_CRYPTO_SIMULATE=0` if using NOWPayments
- [ ] Admin password changed from default
- [ ] HTTPS enabled (automatic on Vercel)
