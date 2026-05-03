# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React 19 + Vite + Turborepo monorepo for Luxero.win prize competition platform. This is one half of a two-repo setup — see the parent directory's CLAUDE.md for the backend repo details.

| | |
|---|---|
| Remote | `github.com/mihailnica10/luxero-frontend.git` |
| Deploy | Vercel (web app + API serverless) |
| Stack | React Router v7, Tailwind v4, Zustand, shadcn/ui |

## Quick Commands

```bash
bun run dev          # turbo dev — API (3000) + web (5173) + mobile (5174) simultaneously
bun run build        # turbo build
bun run lint         # turbo lint
bun run typecheck    # turbo typecheck

# Individual apps
cd apps/api && bun run dev     # API only (port 3000)
cd apps/web && bun run dev     # Web only (port 5173)
cd apps/mobile && bun run dev  # Mobile only (port 5174)
```

## Structure

```
frontend/
├── apps/
│   ├── api/          # Hono.js REST API (port 3000) — migrated from /backend
│   ├── web/          # Main SPA — react-router-dom v7, Tailwind v4
│   └── mobile/       # Capacitor mobile app (simplified shared pages)
├── packages/shared/  # Workspace packages
│   ├── api-client/   # Fetch-based API wrapper → calls VITE_API_URL
│   ├── auth/         # Auth context + JWT helpers
│   ├── cart/         # Zustand cart store
│   ├── types/        # TypeScript interfaces (Competition, Order, User, etc.) + model types
│   ├── ui/           # shadcn/ui components + custom components
│   └── utils/        # cn() utility, formatters
└── turbo.json
```

## All Routes

Defined in `apps/web/src/App.tsx` using React Router v7 `<Routes>`:

| Path | Page |
|---|---|
| `/` | HomePage |
| `/competitions` | CompetitionsPage |
| `/competitions/:slug` | CompetitionDetailPage |
| `/faq` | FaqPage |
| `/how-it-works` | HowItWorksPage |
| `/free-postal-entry` | FreePostalEntryPage |
| `/winners` | WinnersPage |
| `/cart` | CartPage |
| `/checkout` | CheckoutPage |
| `/auth/login` | LoginPage |
| `/auth/sign-up` | SignUpPage |
| `/dashboard` | DashboardPage |
| `/admin` | AdminDashboardPage |

## UI Conventions

- Tailwind v4 with `--color-gold` custom token (gradient gold theme throughout)
- shadcn/ui components via `packages/shared/ui/src/components/ui/`
- Add components: `bunx shadcn@latest add <component-name>`
- Double-bezel card pattern:
  ```tsx
  <div className="p-1.5 rounded-[2rem] bg-black/5 ring-1 ring-black/5">
    <div className="rounded-[calc(2rem-0.375rem)] bg-card p-6">{/* content */}</div>
  </div>
  ```
- Page layout: `<Header />` + `<main>` + `<Footer />`

## Environment

### Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:3000
```

### API (`apps/api/.env.local`):
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/luxero
JWT_SECRET=dev-secret-do-not-use-in-production
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
SMTP_ENABLED=false
```

## API Client

`@luxero/api-client` wraps all backend calls:
```ts
import { api } from "@luxero/api-client";
const res = await api.get<ApiResponse<Competition[]>>("/api/competitions");
```

## Shared Types

`@luxero/types` provides TypeScript interfaces for both frontend and API:
- `models/` — plain TypeScript interfaces for all data models (Competition, Order, Entry, etc.)
- `auth.ts` — `JWTPayload` interface
- Existing frontend types (ApiResponse, User, AuthResponse, etc.)

## Development Notes

- Use **bun** as package manager
- The mobile app (`apps/mobile/`) shares the same API client and router — backend changes must work for both
- The `shadcn` CLI is available: `bunx shadcn@latest add <component>`
- Vercel deploys `apps/web/dist/` for the frontend
- API is deployed as serverless functions from `apps/api/dist/`