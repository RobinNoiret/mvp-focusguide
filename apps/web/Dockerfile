FROM node:20-alpine

ARG CACHEBUST=1

RUN npm install -g pnpm@8

WORKDIR /app
ENV CI=true

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
COPY packages/config ./packages/config

RUN pnpm --filter @focus-guide/web build

EXPOSE 3000
WORKDIR /app/apps/web
CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0"]
