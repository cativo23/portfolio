FROM node:24-bookworm

LABEL org.opencontainers.image.authors="cativo23.kt@gmail.com"

ENV NODE_ENV=development

# Install native build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Allow node user sudo access
RUN echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER node

WORKDIR /home/node/app

# Copy dependency files first for layer caching
COPY --chown=node:node package.json yarn.lock ./

# Install all dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Source files come from volume mount in compose.yml
# COPY is here as fallback when running without compose
COPY --chown=node:node . .

EXPOSE 3000

# Listen on all interfaces for Docker accessibility
CMD ["yarn", "dev", "--host", "0.0.0.0"]
