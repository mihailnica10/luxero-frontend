# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview — Two-Repo Setup

This project spans **two separate git repositories** with independent deploys:

| Repo | Path | Remote | Deploy |
|---|---|---|---|
| Frontend | `/home/misu/work/luxero-win/frontend/` | `github.com/mihailnica10/luxero-frontend.git` | Vercel (web app) |
| Backend | `/home/misu/work/luxero-win/backend/` | `github.com/mihailnica10/luxero-backend.git` | Vercel (serverless) |

Both repos share the same parent directory (`/home/misu/work/luxero-win/`) but have independent `.git` directories. **Always check `git status` in the correct subdirectory** — commands run from the parent will fail since there is no root git repo.

Current working directory context matters: always `cd` to the relevant repo before running git commands.

---

## Project Stack

- **Frontend**: React 19 + Vite + Turborepo monorepo (web + mobile via Capacitor), React Router v7, Tailwind CSS v4
- **Backend**: Hono.js + MongoDB (Mongoose) REST API, deployed as Vercel serverless functions
- **Shared packages** (in frontend repo only): `@luxero/api-client`, `@luxero/auth`, `@luxero/cart`, `@luxero/types`, `@luxero/ui`, `@luxero/utils`, `@luxero/i18n`

---

## Quick Commands

### Frontend Repo (`/home/misu/work/luxero-win/frontend/`)
```bash
bun run dev          # turbo dev — starts web (5173) + mobile (5174) simultaneously
bun run build        # turbo build — builds all packages
bun run lint          # turbo lint
bun run typecheck    # turbo typecheck

# Individual apps
cd apps/web && bun run dev      # Web app only
cd apps/web && bun run build    # Web production build
cd apps/mobile && bun run dev   # Mobile app only
```

### Backend Repo (`/home/misu/work/luxero-win/backend/`)
```bash
bun run dev            # tsx watch on port 3000 (local dev server)
bun run build          # esbuild bundle to dist/ (for Vercel)
bun run lint           # biome check
bun run typecheck      # tsc --noEmit
```

### Database (Backend repo)
```bash
docker compose up -d mongodb   # MongoDB on port 27017 (backend/.env points to localhost:27017)
```

---

## Architecture

### Frontend Repo Structure
```
frontend/
├── apps/
│   ├── web/           # Main React SPA — react-router-dom v7, Tailwind v4, Vite
│   └── mobile/       # Capacitor mobile app (simplified versions of shared pages)
├── packages/shared/  # Workspace packages
│   ├── api-client/   # Fetch-based API wrapper
│   ├── auth/         # Auth context + JWT helpers
│   ├── cart/         # Zustand cart store
│   ├── types/        # TypeScript interfaces (Competition, Order, User, Winner, etc.)
│   ├── ui/           # shadcn/ui components + custom components (Accordion, Dialog, etc.)
│   └── utils/        # cn(), formatters
└── turbo.json
```

### Backend Repo Structure
```
backend/
├── src/
│   ├── index.ts       # Hono app entry + all route registrations
│   ├── db.ts          # Mongoose MongoDB connection
│   ├── routes/        # API route handlers (competitions, faq, content, auth, etc.)
│   ├── models/        # Mongoose schemas (Competition, Winner, Order, User, etc.)
│   ├── middleware/    # JWT auth middleware
│   ├── lib/           # JWT, email, response helpers
│   └── email/         # React Email templates
├── dist/              # esbuild output (Vercel serverless functions)
├── vercel.json       # Vercel config: buildCommand=bun run build, outputDirectory=dist
└── docker-compose.yml # Local MongoDB
```

### API Design (Backend)
- All routes registered in `backend/src/index.ts`
- Public routes: `/api/competitions`, `/api/faq`, `/api/faq/categories`, `/api/content/*`, `/api/winners`
- User-protected routes: `/api/me/*` (entries, orders, profile, referrals) — requires JWT
- Admin routes: `/api/admin/*` (requires admin JWT)
- MongoDB is the sole database

### Frontend Routing (React Router v7)
- All routes defined in `frontend/apps/web/src/App.tsx` using `<Routes>` component
- Shared layout via `Header` + `Footer` components wrapping all pages
- Mobile app shares most page components but uses simplified/adapted versions

### Key Data Models
- **Competition**: `title`, `slug`, `ticketPrice`, `prizeValue`, `maxTickets`, `ticketsSold`, `drawDate`, `status`, `category`
- **Order**: `userId`, `items[]`, `totalPrice`, `status`
- **User**: `email`, `passwordHash`, `role` (user/admin)

---

## UI Conventions

- Tailwind v4 with `--color-gold` custom token (gradient gold theme throughout)
- shadcn/ui components via `packages/shared/ui/src/components/ui/` — use `bunx shadcn@latest add <component>` to add new ones
- All page layouts follow: `<Header />` + `<main>` + `<Footer />`
- Premium corner radius: `rounded-[1.5rem]` or `rounded-[2rem]`
- Double-bezel card pattern:
  ```tsx
  <div className="p-1.5 rounded-[2rem] bg-black/5 ring-1 ring-black/5">
    <div className="rounded-[calc(2rem-0.375rem)] bg-card p-6">
      {/* content */}
    </div>
  </div>
  ```

---

## Environment Variables

### Frontend (`.env` in `frontend/`)
```
VITE_API_URL=http://localhost:3000
```

### Backend (`.env` in `backend/`)
```
MONGODB_URI=mongodb://localhost:27017/luxero
JWT_SECRET=your-secret
RESEND_API_KEY=re_...
SMTP_HOST=localhost
SMTP_PORT=1025
```

---

## Development Notes

- Use **bun** as package manager throughout (not npm/yarn/pnpm)
- Backend CORS is open (`origin: "*"`) — admin routes require JWT validation in middleware, but network-level protection should be considered for production
- The `dist/` directory is gitignored but IS deployed to Vercel (tracked in `vercel.json` outputDirectory)
- When changing API routes, ensure both repos' builds pass (`bun run build` in each)
- The `.vercel/` directory in backend contains Vercel project linking info
- MongoDB connection string format: `mongodb://user:pass@host:27017/dbname?ssl=true` (for Atlas/remote) or `mongodb://localhost:27017/luxero` (local)