# Frontend (Next.js) Dockerfile
# NOTE: EasyPanel uses the REPO ROOT as the Docker build context, so all
# source COPYs must be prefixed with "frontend/".
# Uses Debian (not Alpine) so Prisma's query engine uses the system libssl3.
# syntax=docker/dockerfile:1

FROM node:20-slim AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --no-audit --no-fund

FROM base AS builder
WORKDIR /app

# Build-time public env vars (Next.js inlines these into the client bundle).
# Defaults match production; override via EasyPanel "Build Environment" if needed.
ARG NEXT_PUBLIC_API_URL=https://api.wardabeaute.com
ARG NEXT_PUBLIC_SITE_URL=https://wardabeaute.com
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=212600000000
ARG NEXT_PUBLIC_FB_PIXEL_ID=
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID=
ARG NEXT_PUBLIC_GTM_ID=
ARG NEXT_PUBLIC_PIXELS_ENABLED=true
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_FB_PIXEL_ID=$NEXT_PUBLIC_FB_PIXEL_ID
ENV NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_PIXELS_ENABLED=$NEXT_PUBLIC_PIXELS_ENABLED

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
RUN ./node_modules/.bin/prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Ensure libssl3 (for Prisma engine) and CA certs are present
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN groupadd -g 1001 nodejs && useradd -m -u 1001 -g nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

# App runs as non-root "nextjs"; give it ownership so prisma db push (and
# Next.js runtime) can write to node_modules / .next at runtime.
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --skip-generate --accept-data-loss && npm run start"]
