# syntax=docker/dockerfile:1.7

FROM node:22.17.0-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
RUN npm install --global pnpm@12.16.1
WORKDIR /app

# Copy dependency manifests first so source changes do not invalidate this layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Keep the pnpm content-addressable store between builds without adding it to
# the application image.
RUN --mount=type=cache,id=odlabs-pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Build the application
FROM deps AS builder
WORKDIR /app
COPY . .

# Persist Next.js compiler/build cache between Docker builds.
RUN --mount=type=cache,id=odlabs-next-cache,target=/app/.next/cache \
    pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Keep the runtime cache writable by the non-root application user.
RUN mkdir .next && chown nextjs:nodejs .next

# Use Next.js standalone output to keep the production image small.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
