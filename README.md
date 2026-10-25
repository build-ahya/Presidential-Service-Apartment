# Presidential Service Apartments

Next.js 16 · Firestore + Storage (firebase-admin) · NextAuth (JWT) · shadcn/ui · Tailwind 4

## Setup
1. `cp .env.example .env.local` and fill it in (Next only reads `.env.local`, not `local.env`).
2. `npm install && npm run dev`
3. Admin lives at `/admin`. Create or promote a staff account:
   `npm run create-admin -- you@example.com 'a-strong-password' admin`

## Data model (Firestore, under `ROOT_DATABASE_COLLECTION`)
`properties` → `apartments` (each has `propertyId`, `rate.baseRate`, bedrooms/bathrooms/maxGuests) →
`reservations`. Also `content` (`siteContent`, `systemSettings`), `media`, `blog`, `users`.

## Scripts
- `npm run seed` – dry-run migration of the legacy single apartment doc into a property + 3 apartments (`-- --apply` to write).
- `npm run create-admin` – create / reset a staff user.
