# pomodoro-vue

A minimal Pomodoro timer built with Vue 2 + Vuetify, designed for always-on display on an idle phone.

## Background

Sitting for long periods is hard on your back and neck. Most Pomodoro apps are overly complex. The core need is simple: keep the phone screen on with a visible countdown, and get a reminder every 30 minutes to stand up and move.

The intended setup is an idle phone (e.g. Google Pixel 3) placed next to a monitor, running the timer with the screen always on, without occupying the primary phone.

## Battery Management

Keeping a phone plugged in continuously degrades the battery and can cause swelling. The recommended approach is to pair a smart USB switch with Macrodroid for threshold-based charging:

- Battery below 20% → send command to USB switch to start charging
- Battery above 80% → send command to USB switch to cut power

Occasional failures are rare and can be handled manually.

## Tech Stack

- Vue 2 + TypeScript
- Vuetify 2
- Vue Router / Vuex
- PWA support

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm serve

# Build for production
pnpm build
```

## Deployment

Deployed with Docker using nginx:alpine:

```bash
pnpm build
sudo nerdctl build -t docker-hosted.wiloon.com/pomodoro:latest .
sudo nerdctl push docker-hosted.wiloon.com/pomodoro:latest
```

For multi-arch builds (amd64 + arm64), see `deploy.sh`.

