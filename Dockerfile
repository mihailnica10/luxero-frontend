FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules node_modules
COPY tsconfig.json tsconfig.app.json ./
COPY vite.config.ts tailwind.config.js postcss.config.js ./
COPY src ./src
RUN bun run build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY package.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 5173

CMD ["bun", "run", "dev", "--host"]