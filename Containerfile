# Stage 1: build
FROM node:25.9.0-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: serve
FROM nginx:alpine AS prod
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
