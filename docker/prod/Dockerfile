# ---- Stage 1: Install dependencies ----
FROM node:22-bookworm-slim AS deps

# Install native build tools for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

# Install ALL deps (devDependencies needed for build)
RUN yarn install --frozen-lockfile

# ---- Stage 2: Build the application ----
FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# ---- Stage 3: Production runtime ----
FROM node:22-bookworm-slim AS runtime

LABEL org.opencontainers.image.authors="cativo23.kt@gmail.com"

ENV NODE_ENV=production

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nuxt && \
    adduser --system --uid 1001 --ingroup nuxt nuxt

# Copy only the built output
COPY --from=build --chown=nuxt:nuxt /app/.output ./.output

USER nuxt

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://localhost:3000').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
