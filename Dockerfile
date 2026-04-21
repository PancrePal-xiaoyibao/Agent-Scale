FROM node:20-alpine AS base
RUN corepack disable && npm install -g bun

# --- deps ---
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

# --- build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

RUN bun run build

# --- runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN adduser -S -u 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=1001:0 /app/.next/standalone ./
COPY --from=builder --chown=1001:0 /app/.next/static ./.next/static

COPY --chown=1001:0 supabase/migrations ./supabase/migrations
COPY --chown=1001:0 scripts/migrate.mjs ./scripts/migrate.mjs

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "-c", "node scripts/migrate.mjs && node server.js"]
