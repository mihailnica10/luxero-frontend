# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in `apps/api/`.

## Project Overview

Hono.js + MongoDB REST API for Luxero premium prize competitions. This is the API app within the Turborepo monorepo at `/home/misu/work/luxero-win/frontend/`.

| | |
|---|---|
| Port | 3000 |
| Entry | `src/dev.ts` (dev) / `dist/index.js` (production) |
| Database | MongoDB via Mongoose |
| Deploy | Vercel serverless (from `dist/`) |

## Quick Commands

```bash
bun run dev          # tsx watch on port 3000
bun run build        # esbuild bundle to dist/ (for Vercel)
bun run typecheck    # tsc --noEmit
bun run lint         # biome check src/
```

## Structure

```
apps/api/
├── src/
│   ├── index.ts       # Hono app entry + all route registrations
│   ├── dev.ts         # Dev server (tsx watch)
│   ├── db.ts          # Mongoose connection
│   ├── routes/        # API route handlers
│   ├── models/        # Mongoose schemas
│   ├── middleware/    # JWT auth middleware
│   ├── lib/          # JWT, email, helpers
│   └── email/        # React Email templates
├── dist/              # esbuild output (deployed to Vercel)
├── build.mjs         # esbuild bundler script
├── vercel.json       # Vercel config
└── Dockerfile        # Docker image for production
```

## Key Routes

| Route | Description |
|---|---|
| `GET /api/competitions` | List competitions with pagination |
| `GET /api/competitions/:slug` | Single competition detail |
| `GET /api/faq` | FAQs by category |
| `GET /api/faq/categories` | FAQ category list |
| `GET /api/content/steps` | How It Works steps |
| `GET /api/content/features` | Why Choose Luxero features |
| `GET /api/winners` | Winner listings + stats |
| `POST /api/auth/*` | Authentication (register, login, forgot-password) |
| `GET /api/me/*` | User-protected: orders, entries, profile |
| `POST /api/me/*` | User-protected: update profile |
| `GET /api/admin/*` | Admin-protected: competitions, orders, users |
| `POST /api/payments/*` | Stripe Checkout + webhook |
| `GET /health` | Health check with MongoDB ping |

## Security

- CORS restricted to known origins (web app, mobile app)
- Rate limiting on auth endpoints (5 attempts / 15 minutes)
- JWT_SECRET placeholder guard in production
- Security headers on all responses
- Request logging

## Environment Variables

See `.env.local` for local development. Production variables are set in Vercel dashboard.

## Shared Types

The API uses `@luxero/types` for TypeScript interfaces:
- `JWTPayload` is imported from `@luxero/types` (defined in `packages/shared/types/src/auth.ts`)
- Model interfaces (Competition, Order, etc.) are also available from `@luxero/types`