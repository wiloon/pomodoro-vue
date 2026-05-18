# pomodoro-vue

A minimal Pomodoro timer built with Vue 3 + Vuetify 3, designed for always-on display on an idle phone.

Live: [https://pomodoro.wiloon.com/](https://pomodoro.wiloon.com/)

## Background

Sitting for long periods is hard on your back and neck. Most Pomodoro apps are overly complex or require an account. This one is intentionally minimal — a PWA that works offline, no sign-in, no task lists. The core need is simple: keep the phone screen on with a visible countdown, and get a reminder every 30 minutes to stand up and move.

The intended setup is an idle phone (e.g. Google Pixel 3) placed next to a monitor, running the timer with the screen always on, without occupying the primary phone.

## Battery Management

Keeping a phone plugged in continuously degrades the battery and can cause swelling. The recommended approach is to pair a smart USB switch with Macrodroid for threshold-based charging:

- Battery below 20% → send command to USB switch to start charging
- Battery above 80% → send command to USB switch to cut power

Occasional failures are rare and can be handled manually.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Vue 3 + TypeScript (Composition API) |
| UI | Vuetify 4 + MDI icons |
| Router | Vue Router 5 |
| Build | Vite 8 + vite-plugin-vuetify |
| PWA | vite-plugin-pwa (Service Worker, offline support) |
| Package manager | pnpm |
| Analytics | Umami Analytics (privacy-friendly, no cookies) |
| Hosting | Cloudflare Pages |
| DNS / CDN | Cloudflare (proxied, global edge network) |
| Infrastructure | OpenTofu (managed in a private config repo) |

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Deployment

Push to `main` → Cloudflare Pages automatically builds and deploys. No CI/CD configuration required.

```
push to main
     │
     ▼
Cloudflare Pages: pnpm build
     │
     ▼
dist/ deployed to global CDN edge nodes
     │
     ▼
https://pomodoro.wiloon.com live immediately
```

### Infrastructure

The Cloudflare Pages project, custom domain binding, and DNS record are managed with OpenTofu.

| Resource | Description |
| --- | --- |
| `cloudflare_pages_project` | Pages project connected to this GitHub repo, build command `pnpm build` |
| `cloudflare_pages_domain` | Custom domain binding for `pomodoro.wiloon.com` |
| `cloudflare_record` | DNS CNAME `pomodoro.wiloon.com` → `pomodoro-4pw.pages.dev` |
