FROM node:20-alpine

ARG CACHEBUST=1

RUN npm install -g pnpm@8

WORKDIR /app

# Copier les fichiers workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

# Installer les dépendances
RUN pnpm install --frozen-lockfile --force

# Copier le code source
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
COPY packages/config ./packages/config

# Build
RUN pnpm --filter @focus-guide/web build

EXPOSE 3000

CMD ["pnpm", "--filter", "@focus-guide/web", "start"]
