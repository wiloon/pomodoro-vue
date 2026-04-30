# Stage 1: build
FROM node:25.9.0-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: serve
FROM joseluisq/static-web-server:2
LABEL org.opencontainers.image.description="Pomodoro timer web app"
COPY --from=builder /app/dist/ /public/
# SPA fallback: redirect 404s to index.html for Vue Router history mode
ENV SERVER_FALLBACK_PAGE=/public/index.html
