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

# Force node-server preset (overrides @nuxthub/core's cloudflare preset)
ENV NITRO_PRESET=node-server

# Build-time environment variables for Nuxt (embedded at build time)
ARG NUXT_API_BASE_URL
ARG NUXT_API_BASE_PATH
ARG NUXT_API_TOKEN
ENV NUXT_API_BASE_URL=${NUXT_API_BASE_URL}
ENV NUXT_API_BASE_PATH=${NUXT_API_BASE_PATH}
ENV NUXT_API_TOKEN=${NUXT_API_TOKEN}

RUN yarn build

# ---- Stage 3: Production dependencies ----
FROM node:22-bookworm-slim AS production-deps

WORKDIR /app

# Install libvips BEFORE installing sharp so it compiles against system libvips
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

# Install only production dependencies (includes sharp - will compile against system libvips)
RUN yarn install --frozen-lockfile --production

# ---- Stage 4: Production runtime ----
FROM node:22-bookworm-slim AS runtime

LABEL org.opencontainers.image.authors="cativo23.kt@gmail.com"

ENV NODE_ENV=production

WORKDIR /app

# Install libvips runtime (same as production-deps stage)
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system --gid 1001 nuxt && \
    adduser --system --uid 1001 --ingroup nuxt nuxt

# Copy production dependencies
COPY --from=production-deps --chown=nuxt:nuxt /app/node_modules ./node_modules

# Copy built output
COPY --from=build --chown=nuxt:nuxt /app/.output ./.output

USER nuxt

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://localhost:3000').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
