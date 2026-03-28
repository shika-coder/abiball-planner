# Abiball Planer

Startup-style MVP for German high school graduation party planning. The app is built with Next.js, Tailwind CSS, and mock location data exposed through API routes.

## Features

- Search and filter venues by city, guests, budget per person, total budget, and venue features
- Hamburg starter dataset with 8 realistic graduation-event locations
- Venue detail page with gallery, pricing, capacity, and live budget calculator
- Favorites and comparison shortlist stored in the browser
- Admin Lab for adding custom locations locally and exporting them as JSON
- API routes at `/api/locations` and `/api/locations/[id]`

## Stack

- Next.js App Router
- React 19
- Tailwind CSS
- Mock JSON/TypeScript data layer, structured to scale toward PostgreSQL/Prisma later

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project notes

- Primary mock data lives in `src/data/locations.ts`
- The city system is already normalized around a `city` field and `supportedCities`
- For production, move the `Location` model into Prisma/PostgreSQL and replace the mock data import with repository calls
- The Admin Lab intentionally persists only in `localStorage` for MVP speed and zero backend setup
