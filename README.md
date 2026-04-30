# Luxero Frontend

React 19 + Vite + Tailwind CSS for Luxero premium prize competitions.

## Setup

```bash
bun install
cp .env.example .env   # VITE_API_URL set automatically by toolkit
```

## Dev

```bash
bun run dev        # Vite on port 5173
bun run typecheck  # tsc --noEmit
bun run lint       # biome check
bun run format    # biome format --write
```

## Structure

```
src/
├── components/         # React components + shadcn/ui
├── pages/              # Route pages
├── contexts/           # Auth + Cart Zustand stores
├── lib/                # API client, utilities
└── i18n.ts             # i18next config
```

## Connecting to Backend

The frontend connects to the backend via `VITE_API_URL` environment variable. During `toolkit start`, the toolkit writes this to `frontend/.env` automatically.

```env
VITE_API_URL=http://localhost:3000
```
