# --- deps ---
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# --- build ---
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx next build

# --- runner ---
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN useradd --system --uid 1001 nextjs

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
