# LankaTrails Admin Dashboard

[![CI](https://github.com/LankaTrails/lankatrails-admin-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/LankaTrails/lankatrails-admin-dashboard/actions/workflows/ci.yml)

The administration web app of [LankaTrails](https://github.com/LankaTrails/lankatrails-backend), a
travel platform for Sri Lanka. Administrators verify service providers, resolve tourist complaints
and refunds, and keep an eye on bookings and platform activity.

## Features

- **Admin-only sign in:** JWT authentication with automatic token refresh; other roles are refused.
- **Provider verification:** review each provider's business details, identity and licence
  documents, and approve or reject them per service type.
- **Complaints and refunds:** work through tourist complaints, reply to the tourist, and approve or
  reject refunds, which are issued through Stripe.
- **Bookings:** platform-wide booking list with status and payment details.
- **Analytics:** dashboard and charts for bookings, revenue and providers.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Radix UI · Redux Toolkit · React Router · Axios ·
Recharts · Lucide icons

## Run it

The dashboard runs as part of the LankaTrails Docker Compose stack, defined in the backend repo.
Clone this repo next to `lankatrails-backend`, then follow the
[backend README](https://github.com/LankaTrails/lankatrails-backend#run-the-whole-system-with-docker):

```bash
cp .env.example .env                                   # in this repo
cd ../lankatrails-backend
docker compose -f docker-compose.dev.yml up --build -d
```

Open http://localhost:5173. Code changes reload instantly (Vite HMR); dependencies are installed
inside the container.

Without Docker, use Node 24 and run `npm ci && npm run dev`, with the backend reachable at
`VITE_API_BASE_URL`.

### Admin account

The backend creates the admin account on its first start from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in
`lankatrails-backend/.env`. Sign in with those. Loading the backend's demo data
(`./docker/seed/load-seed.sh`) gives you a provider, licences, bookings and complaints to work with.

## Environment variables

Copy `.env.example` to `.env`.

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend REST API; defaults to `http://localhost:8080/api` |
| `VITE_BASE_URL` | Backend origin for uploaded documents; defaults to the API URL without `/api` |

## Scripts

```bash
npm run dev         # dev server on port 5173
npm run typecheck   # tsc against tsconfig.app.json
npm run lint        # eslint
npm run build       # type check and production build to dist/
```

In Docker, run them with
`docker compose -f docker-compose.dev.yml exec admin-dashboard npm run <script>` from
`lankatrails-backend`. GitHub Actions runs the type check, lint and build on every push and pull
request.

## Project layout

```
src/
  pages/        login, admin area (dashboard, providers, complaints, bookings, analytics)
  components/   shared UI
  services/     API clients per backend area
  store/        Redux store and auth slice
  api/          Axios instance with token refresh
  lib/          configuration helpers
```

## Screenshots

<!-- Screenshots and GIFs of the dashboard go here. -->

_Coming soon._

## License

[MIT](LICENSE)
