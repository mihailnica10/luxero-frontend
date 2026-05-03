# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Luxero.win prize competition platform — React 19 + Vite + Turborepo monorepo. Vercel deploys the frontend SPA and the API as serverless functions from `apps/api/dist/`.

| | |
|---|---|
| Remote | `github.com/mihailnica10/luxero-frontend.git` |
| Deploy | Vercel (frontend SPA + API serverless) |
| Stack | React Router v7, Tailwind v4, Zustand, shadcn/ui, Hono.js |

## Quick Commands

```bash
bun run dev          # turbo dev — API (3000) + web (5173) + mobile (5174) simultaneously
bun run build        # turbo build
bun run lint         # turbo lint (Biome)
bun run typecheck    # turbo typecheck
bun run clean        # turbo clean + rm -rf node_modules

# Individual apps
cd apps/api && bun run dev      # API only (port 3000)
cd apps/api && bun run build    # esbuild bundle to dist/ (for Vercel)
cd apps/api && bun run seed     # seed MongoDB with categories, competitions, promo codes, demo users
cd apps/web && bun run dev       # Web only (port 5173)
cd apps/mobile && bun run dev    # Mobile only (port 5174)

# Local MongoDB (from apps/api/)
docker compose up -d mongodb     # MongoDB 7.0.4 on port 27018
```

## Structure

```
.                           # Monorepo root
├── apps/
│   ├── api/                # Hono.js REST API (port 3000)
│   ├── web/                # Main SPA — React 19 + Vite (port 5173)
│   └── mobile/             # Capacitor mobile app (port 5174)
├── packages/shared/        # Workspace packages
│   ├── api-client/         # Fetch-based API wrapper → VITE_API_URL
│   ├── auth/               # React Auth context + JWT helpers
│   ├── cart/               # Zustand cart store (persisted to localStorage)
│   ├── i18n/               # i18next configuration
│   ├── types/              # TypeScript interfaces + model types
│   ├── ui/                 # shadcn/ui components + custom components
│   └── utils/              # cn() utility, formatters
└── turbo.json
```

## Apps Architecture

### API (`apps/api/`)

Hono.js REST API backed by MongoDB (Mongoose). Connection string via `MONGODB_URI`.

**Key files:**
- `src/dev.ts` — Dev entry (tsx watch, imports full app from `index.ts`)
- `src/index.ts` — Production Hono app export (used by Vercel serverless)
- `src/db.ts` — MongoDB connection singleton (`global.mongoose`, pooled)
- `src/models/` — 13 Mongoose models
- `src/routes/` — Route handlers (auth, competitions, orders, payments, me, admin, etc.)
- `src/middleware/auth.ts` — JWT middleware (`auth`, `requireAdmin`)
- `src/lib/jwt.ts` — `signToken()` / `verifyToken()` (jsonwebtoken, 7-day expiry)
- `src/lib/response.ts` — `success()`, `created()`, `error()`, `paginated()` helpers
- `src/email/client.ts` — Email via Resend API or SMTP (toggle via `SMTP_ENABLED`)

**Global middleware order** (`src/dev.ts`):
1. Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
2. Request logging (`method path status ms`)
3. CORS (origins: `luxero.win`, `www.luxero.win`, `capacitor://localhost`, `localhost:5173/5174`)
4. Route-level: auth rate limiter → auth middleware → requireAdmin

**API response envelope:** `{ "data": T, "meta": { "page", "limit", "total", "pages" } }`
**Error envelope:** `{ "error": { "code", "message", "details? } }`

### Web (`apps/web/`)

React 19 SPA. Uses React Router v7, TanStack Query (auth mutations only), Zustand (cart), Tailwind v4 with custom gold tokens.

**Key files:**
- `src/main.tsx` — Entry: `QueryClientProvider > ThemeProvider > BrowserRouter > App`
- `src/App.tsx` — All routes via `<Routes>`, wrapped by `<AuthProvider>`
- `src/index.css` — Tailwind `@theme` with `--color-gold` custom tokens, custom animations
- `src/components/layout/Header.tsx` — Sticky nav with cart button + user dropdown
- `src/components/layout/Footer.tsx` — 4-column links + social
- `src/components/home/` — `HeroSlider`, `CompetitionCard`, `CategoryNav`, `CategorySection`, `WinnersShowcase`

**TanStack Query config:** `staleTime: 60s`, `retry: false`. Plain `useEffect + api.get()` for most data fetching; `useMutation` only on auth forms (login, sign-up, verify-email, forgot/reset password).

### Mobile (`apps/mobile/`)

Capacitor app (Android/iOS shells). Shares all `@luxero/*` packages with web app. Simplified page set (10 pages vs 30+ on web).

**Key differences from web:**
- Bottom tab bar (`MobileLayout`) — tabs: Home, Competitions, Cart, Account
- No admin pages, no dashboard pages
- Custom Android `WebViewClient` (`MainActivity.java`) — restricts navigation to `luxero.win` and `localhost`; external links open in system browser
- Dev port 5174, production `VITE_API_URL=https://api.luxero.win`

### Shared Packages

| Package | Purpose |
|---|---|
| `@luxero/api-client` | Fetch wrapper — injects JWT from `localStorage`, auto-redirects on 401 |
| `@luxero/auth` | React `AuthProvider` — `login()`, `logout()`, `register()`, `updateProfile()`, `isAdmin` |
| `@luxero/cart` | Zustand store — `luxero-cart` localStorage key, persists cart |
| `@luxero/types` | TypeScript interfaces for all models, auth, API responses |
| `@luxero/ui` | shadcn/ui components, `ThemeProvider`, `ProtectedRoute`, double-bezel card pattern |
| `@luxero/utils` | `cn()` utility, formatters |

## Web Routes (`apps/web/src/App.tsx`)

| Path | Page | Guard |
|---|---|---|
| `/` | HomePage | — |
| `/competitions` | CompetitionsPage | — |
| `/competitions/:slug` | CompetitionDetailPage | — |
| `/entries` | EntriesPage | — |
| `/cart` | CartPage | — |
| `/checkout` | CheckoutPage | — |
| `/checkout/success` | CheckoutSuccessPage | — |
| `/auth/login` | LoginPage | — |
| `/auth/sign-up` | SignUpPage | — |
| `/auth/verify-email` | VerifyEmailPage | — |
| `/auth/forgot-password` | ForgotPasswordPage | — |
| `/auth/reset-password` | ResetPasswordPage | — |
| `/faq` | FaqPage | — |
| `/how-it-works` | HowItWorksPage | — |
| `/winners` | WinnersPage | — |
| `/about` | AboutPage | — |
| `/contact` | ContactPage | — |
| `/terms` | TermsPage | — |
| `/privacy` | PrivacyPage | — |
| `/free-postal-entry` | FreePostalEntryPage | — |
| `/dashboard` | DashboardPage | ProtectedRoute |
| `/dashboard/orders` | DashboardOrdersPage | ProtectedRoute |
| `/dashboard/tickets` | DashboardTicketsPage | ProtectedRoute |
| `/dashboard/wins` | DashboardWinsPage | ProtectedRoute |
| `/dashboard/profile` | DashboardProfilePage | ProtectedRoute |
| `/dashboard/referrals` | DashboardReferralsPage | ProtectedRoute |
| `/admin` | AdminDashboardPage | ProtectedRoute adminOnly |
| `/admin/competitions` | CompetitionsAdminPage | ProtectedRoute adminOnly |
| `/admin/competitions/new` | CompetitionNewAdminPage | ProtectedRoute adminOnly |
| `/admin/orders` | OrdersAdminPage | ProtectedRoute adminOnly |
| `/admin/users` | UsersAdminPage | ProtectedRoute adminOnly |
| `/admin/promo-codes` | PromoCodesAdminPage | ProtectedRoute adminOnly |
| `/admin/instant-prizes` | InstantPrizesAdminPage | ProtectedRoute adminOnly |
| `/admin/categories` | CategoriesAdminPage | ProtectedRoute adminOnly |
| `/admin/referrals` | ReferralsAdminPage | ProtectedRoute adminOnly |

## Mobile Routes (`apps/mobile/src/App.tsx`)

Tab bar routes (wrapped in `MobileLayout` with `<Outlet />`):

| Path | Page | Guard |
|---|---|---|
| `/` | HomePage | — |
| `/competitions` | CompetitionsPage | — |
| `/cart` | CartPage | — |
| `/profile` | ProfilePage | — |

Standalone routes (no tab bar):

| Path | Page |
|---|---|
| `/auth/login` | LoginPage |
| `/auth/sign-up` | SignUpPage |
| `/competitions/:slug` | CompetitionDetailPage |
| `/how-it-works` | HowItWorksPage |
| `/winners` | WinnersPage |
| `/faq` | FaqPage |

## Database Models

All Mongoose models in `apps/api/src/models/`:

| Model | Key Fields |
|---|---|
| `User` | email (unique), passwordHash, isAdmin, isVerified, verificationCode, verificationExpiry, resetCode, resetExpiry |
| `Profile` | email, fullName, country (default GB), referralCode (unique), referredBy, referralCount, referralBalance, totalEntries, totalSpent, winsCount |
| `Competition` | slug (unique), title, category, status (draft/active/ended/drawn), prizeValue, ticketPrice, maxTickets, ticketsSold, drawDate, isFeatured, question, correctAnswer |
| `Order` | orderNumber (unique), userId, status, subtotal, discountAmount, total, promoCodeId, stripeSessionId, paidAt |
| `OrderItem` | orderId, competitionId, quantity, unitPrice, totalPrice, ticketNumbers[] |
| `Entry` | userId, competitionId, orderId, ticketNumbers[], quantity, answerIndex, answerCorrect |
| `Winner` | competitionId, userId, ticketNumber, prizeTitle, prizeValue, displayName, location, testimonial, claimed, drawnAt |
| `PromoCode` | code (unique), discountType (percentage/fixed), discountValue, minOrderValue, maxUses, currentUses, validFrom, validUntil, isActive |
| `InstantPrize` | competitionId, name, description, value, totalQuantity, remainingQuantity, winningTicketNumbers[], prizeType, isActive, startsAt, endsAt |
| `InstantPrizeWin` | instantPrizeId, userId, entryId, ticketNumber, claimed, shippingAddress, wonAt |
| `ReferralPurchase` | referrerId, referredUserId, orderId, purchasedAt |
| `Category` | slug (unique), name, label, iconName, isActive, displayOrder |
| `Language` | code (unique), name, nativeName, isActive, isDefault, displayOrder |

## API Route Reference

### Public
| Method | Path |
|---|---|
| GET | `/api/competitions` — paginated, filter by status/category/exclude |
| GET | `/api/competitions/featured` — up to 6 featured active |
| GET | `/api/competitions/:slug` |
| GET | `/api/competitions/:id/availability` |
| GET | `/api/categories` |
| GET | `/api/winners` — paginated |
| GET | `/api/winners/stats` |
| GET | `/api/stats` — totalPrizeValue, totalUsers, totalEntries (60s cache) |
| POST | `/api/promo-codes/validate` |
| GET | `/api/faq` |
| GET | `/api/faq/categories` |
| GET | `/api/content/steps` |
| GET | `/api/content/features` |
| POST | `/api/contact` |
| GET | `/health` — MongoDB ping |

### Auth (rate-limited: 5 attempts/15min)
| Method | Path |
|---|---|
| POST | `/api/auth/register` — creates User + Profile, sends verification email |
| POST | `/api/auth/login` |
| POST | `/api/auth/verify-email` |
| POST | `/api/auth/resend-verification` |
| POST | `/api/auth/forgot-password` — always succeeds (prevents enumeration) |
| POST | `/api/auth/reset-password` |
| GET | `/api/auth/me` — returns user from JWT |

### User-Protected (`/api/me/*`)
| Method | Path |
|---|---|
| GET | `/api/me/profile` |
| PUT | `/api/me/profile` |
| GET | `/api/me/profile/wins` |
| GET | `/api/me/profile/stats` |
| GET | `/api/me/orders` |
| GET | `/api/me/orders/:id` |
| GET | `/api/me/entries` |
| GET | `/api/me/entries/competition/:competitionId` |
| GET | `/api/me/referrals` |

### Admin-Protected (`/api/admin/*`)
| Method | Path |
|---|---|
| CRUD | `/api/admin/competitions` |
| POST | `/api/admin/competitions/:id/draw` — random winner, fires win email |
| CRUD | `/api/admin/categories` |
| CRUD | `/api/admin/orders` |
| PATCH | `/api/admin/orders/:id/status` |
| CRUD | `/api/admin/users` |
| CRUD | `/api/admin/promo-codes` |
| CRUD | `/api/admin/instant-prizes` |
| CRUD | `/api/admin/referral-purchases` |
| CRUD | `/api/admin/languages` |

### Payments (Stripe)
| Method | Path |
|---|---|
| POST | `/api/payments/create-checkout-session` |
| POST | `/api/payments/webhook` — handles `checkout.session.completed` |
| GET | `/api/payments/session/:sessionId` |

## UI Conventions

- Tailwind v4 with `--color-gold` custom token (gradient gold theme)
- shadcn/ui components via `packages/shared/ui/src/components/ui/`
- Add components: `bunx shadcn@latest add <component-name>`
- Double-bezel card pattern:
  ```tsx
  <div className="p-1.5 rounded-[2rem] bg-black/5 ring-1 ring-black/5">
    <div className="rounded-[calc(2rem-0.375rem)] bg-card p-6">{/* content */}</div>
  </div>
  ```
- Page layout: `<Header />` + `<main>` + `<Footer />`
- Linting: Biome (`biome.json` config)

## API Client Behavior

`@luxero/api-client` (`packages/shared/api-client/src/index.ts`):
- Base URL: `VITE_API_URL` env var (falls back to `http://localhost:3000`)
- Reads JWT from `localStorage.getItem("auth_token")` and injects as `Authorization: Bearer`
- On 401 responses (non-auth paths), auto-redirects to `/auth/login`
- Auth paths that bypass redirect: `/api/auth/login`, `/api/auth/register`, `/api/auth/reset-password`, `/api/auth/forgot-password`, `/api/auth/verify-email`, `/api/auth/resend-verification`

## Auth Flow

**JWT:** `HS256`, 7-day expiry. `JWTPayload`: `{ userId, email, isAdmin }`.

Frontend `AuthProvider` (`@luxero/auth`) restores session on mount by calling `GET /api/auth/me` with the stored JWT. `isAdmin` is `user?.isAdmin ?? false`.

`logout()` clears localStorage only (no server call). `forgot-password` always returns success to prevent email enumeration.

## Payments (Stripe)

`POST /api/payments/create-checkout-session` — validates competitions, creates pending Order, returns Stripe Checkout URL.

`POST /api/payments/webhook` handles `checkout.session.completed`:
- Creates `Entry` records with ticket numbers
- Updates `Competition.ticketsSold`
- Updates Profile (`totalEntries`, `totalSpent`)
- Records `ReferralPurchase` for referred users
- Sends order confirmation email

## Email System

`src/email/client.ts` supports two transports, selected by env:
- **Resend** (`RESEND_API_KEY` set, `SMTP_ENABLED=false`)
- **SMTP** via nodemailer (`SMTP_ENABLED=true`)
- Retries up to 3× with exponential backoff (Resend only, except 4xx non-429)

Templates (React Email, dark theme with gold accents):

| Template | Trigger |
|---|---|
| `welcome.tsx` | Post-registration |
| `email-verification.tsx` | Email verification request |
| `password-reset.tsx` | Forgot password |
| `order-confirmation.tsx` | Order completed via webhook |
| `win-notification.tsx` | Winner drawn |
| `contact-notification.tsx` | Contact form submission |

## Security

- **CORS:** Restricted to `luxero.win`, `www.luxero.win`, `capacitor://localhost`, `localhost:5173/5174`
- **Security headers:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (geolocation, microphone, camera disabled)
- **Rate limiting:** Auth routes — 5 attempts per 15-minute window per IP
- **JWT:** `HS256`, 7-day expiry; production throws if `JWT_SECRET` is still the placeholder
- **Password hashing:** bcrypt cost 12 (auto-hashed on save)
- **Email enumeration prevention:** `forgot-password` and `resend-verification` always return success

## Turborepo Configuration

`turbo.json` at the root:

```json
{
  "globalDependencies": [".env"],
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

- `.env` is a global dependency — any change invalidates all task caches
- Build outputs `dist/` and `.next/` are cached across all packages
- `^build` means each package's build waits for its dependencies' builds first (bottom-up)
- `typecheck` depends on `^build` to ensure types are checked after dependency builds
- `dev` is uncached and persistent (long-running)

## Environment Variables

### Frontend (`.env` at root):
```
VITE_API_URL=http://localhost:3000
```

### API (`apps/api/.env.local`):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/luxero
JWT_SECRET=dev-secret-do-not-use-in-production
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
SMTP_ENABLED=false
```

## Vercel Deployment

- `apps/api/vercel.json` — deploys `dist/` as serverless functions
- `apps/web` — SPA served from `dist/` with React Router rewrites
