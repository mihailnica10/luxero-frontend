# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this frontend repository.

## Project Overview

React 19 + Vite + Turborepo monorepo for Luxero.win prize competition platform. This is one half of a two-repo setup — see the parent directory's CLAUDE.md for the backend repo details.

| | |
|---|---|
| Remote | `github.com/mihailnica10/luxero-frontend.git` |
| Deploy | Vercel (web app) |
| Stack | React Router v7, Tailwind v4, Zustand, shadcn/ui |

## Quick Commands

```bash
bun run dev          # turbo dev — web (5173) + mobile (5174)
bun run build        # turbo build
bun run lint         # turbo lint
bun run typecheck    # turbo typecheck

# Individual apps
cd apps/web && bun run dev      # Web only
cd apps/web && bun run build    # Web production build
cd apps/mobile && bun run dev   # Mobile only
```

## Structure

```
frontend/
├── apps/
│   ├── web/          # Main SPA — react-router-dom v7, Tailwind v4
│   └── mobile/       # Capacitor mobile app (simplified shared pages)
├── packages/shared/  # Workspace packages
│   ├── api-client/   # Fetch-based API wrapper → calls VITE_API_URL
│   ├── auth/         # Auth context + JWT helpers
│   ├── cart/         # Zustand cart store
│   ├── types/        # TypeScript interfaces (Competition, Order, User, etc.)
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

`frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```

For production, `VITE_API_URL` points to the deployed backend URL.

## API Client

`@luxero/api-client` wraps all backend calls:
```ts
import { api } from "@luxero/api-client";
const res = await api.get<ApiResponse<Competition[]>>("/api/competitions");
```

## Development Notes

- Use **bun** as package manager
- The mobile app (`apps/mobile/`) shares the same API client and router — backend changes must work for both
- The `shadcn` CLI is available: `bunx shadcn@latest add <component>`
- Vercel deploys the Vite build output from `apps/web/dist/`