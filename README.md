# pomodoro-vue

A minimal Pomodoro timer built with Vue 3 + Vuetify 3, designed for always-on display on an idle phone.

Live: https://pomodoro.wiloon.com/

## Background

Sitting for long periods is hard on your back and neck. Most Pomodoro apps are overly complex. The core need is simple: keep the phone screen on with a visible countdown, and get a reminder every 30 minutes to stand up and move.

The intended setup is an idle phone (e.g. Google Pixel 3) placed next to a monitor, running the timer with the screen always on, without occupying the primary phone.

## Battery Management

Keeping a phone plugged in continuously degrades the battery and can cause swelling. The recommended approach is to pair a smart USB switch with Macrodroid for threshold-based charging:

- Battery below 20% → send command to USB switch to start charging
- Battery above 80% → send command to USB switch to cut power

Occasional failures are rare and can be handled manually.

## Tech Stack

- Vue 3 + TypeScript
- Vuetify 3
- Vue Router 4
- Vite 6
- vite-plugin-pwa (Service Worker, offline support)

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

Pushing to the `main` branch triggers a GitHub Actions workflow that:

1. Builds the Docker image and pushes it to GHCR (`ghcr.io/wiloon/pomodoro-vue`)
2. SSHes into EC2 and restarts the service with the new image
