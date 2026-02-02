# QR Tracker

Generate trackable QR codes with built-in analytics. Create short URLs encoded as QR codes, then see who scanned them — device info, location, referrers, and scan patterns over time.

## Features

- **QR code generation** — paste a URL, get a downloadable QR code with a tracking short link
- **Scan tracking** — captures device type, OS, browser, country, city, and referrer on every scan
- **Analytics dashboard** — per-code dashboard with scan charts, geo breakdown, device stats, and unique visitor counts
- **Visitor identification** — cookie-based visitor ID distinguishes unique vs. repeat scans
- **API access** — JSON endpoint for programmatic analytics retrieval

## Tech stack

- Next.js 16 / React 19 / TypeScript
- PostgreSQL via Vercel Postgres
- Drizzle ORM
- Recharts (analytics charts)
- nanoid (short code generation)
- ua-parser-js (device detection)
- Tailwind CSS 4

## Setup

```bash
npm install
```

Create `.env.local`:

```
POSTGRES_URL=<your-postgres-connection-string>
```

Run database migrations and start the dev server:

```bash
npx drizzle-kit push
npm run dev
```

## How it works

1. User submits a destination URL on the home page
2. Server generates an 8-character short code and a QR code PNG (512x512)
3. Scanning the QR code hits `/r/{shortCode}`, which logs analytics and redirects (307) to the destination
4. Geolocation comes from Vercel's `x-vercel-ip-*` headers — no external geo API needed
5. Analytics are viewable at `/a/{shortCode}` or via `/api/analytics/{shortCode}`

## Project structure

```
src/
  app/
    page.tsx                        # Home page (QR form)
    actions.ts                      # Server action: createQrCode()
    r/[shortCode]/route.ts          # Tracking redirect
    a/[shortCode]/page.tsx          # Analytics dashboard
    api/analytics/[shortCode]/      # JSON analytics endpoint
  components/
    qr-form.tsx                     # URL input form
    qr-result.tsx                   # Generated QR display + download
    analytics/                      # Dashboard components
      stats-cards.tsx
      scan-chart.tsx
      country-table.tsx
      device-breakdown.tsx
      referrer-table.tsx
  db/
    schema.ts                       # Tables: qr_codes, scans
    index.ts                        # Database connection
  lib/
    analytics.ts                    # Query functions
```

## Deployment

Deploy to [Vercel](https://vercel.com) with a Vercel Postgres database. Set `POSTGRES_URL` as an environment variable. Geolocation headers are provided automatically by Vercel's edge network.
