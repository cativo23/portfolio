# ---- Stage 1: Build ----
  FROM node:22-alpine AS build

  WORKDIR /app

  COPY package.json yarn.lock ./
  RUN yarn install

  COPY . .

  ENV NITRO_PRESET=node-server

  ARG NUXT_API_BASE_URL
  ARG NUXT_API_BASE_PATH
  ARG NUXT_API_TOKEN
  ENV NUXT_API_BASE_URL=${NUXT_API_BASE_URL}
  ENV NUXT_API_BASE_PATH=${NUXT_API_BASE_PATH}
  ENV NUXT_API_TOKEN=${NUXT_API_TOKEN}

  RUN yarn nuxt prepare
  RUN yarn build

  # ---- Stage 2: Production runtime ----
  FROM node:22-alpine AS runtime

  LABEL org.opencontainers.image.authors="cativo23.kt@gmail.com"

  ENV NODE_ENV=production

  WORKDIR /app

  RUN addgroup --system --gid 1001 nuxt && \
      adduser --system --uid 1001 --ingroup nuxt nuxt

  COPY --from=build --chown=nuxt:nuxt /app/.output ./.output

  USER nuxt

  EXPOSE 3000

  HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD node -e "fetch('http://localhost:3000').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

  CMD ["node", ".output/server/index.mjs"]