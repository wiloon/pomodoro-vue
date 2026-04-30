# ADR 0001: Web Analytics for Pomodoro Timer

**Date:** 2026-04-30  
**Status:** Accepted

## Context

The pomodoro-vue app is a static single-page application with no backend. We want basic usage
statistics — page views, unique visitors, rough geographic location, device type, and PWA install
count — to understand who is using the tool and whether the PWA installation feature is adopted.

Requirements:

- No backend infrastructure to build or maintain
- Privacy-respecting: no cross-site tracking, no personal data stored
- PWA install events trackable as custom events
- Lightweight: minimal impact on page load

## Decision

Use **Umami Analytics** (cloud-hosted at cloud.umami.is, Hobby plan — free).

A single `<script>` tag is added to `index.html`. No cookies are set, no personal data is
collected. Page views and custom events are sent to Umami's servers automatically.

PWA install events are tracked by listening to the browser's `appinstalled` event and calling
`umami.track('PWA Installed')`.

The Umami script is loaded with `defer` so it never blocks rendering. If the script fails
to load (e.g. ad blocker), the app continues to work normally — analytics is best-effort only.

## Alternatives Considered

| Option | Reason not chosen |
| --- | --- |
| Umami (self-hosted) | Requires PostgreSQL + server; more infrastructure than justified for a personal tool. Cloud Hobby tier used instead. |
| Google Analytics 4 | Heavy (~45 KB), cookie-based, privacy concerns |
| Cloudflare Web Analytics | Requires Cloudflare proxying the domain; adds DNS coupling |
| Custom backend endpoint | Unnecessary complexity; Plausible covers the use case |

## Consequences

- Umami Hobby plan is free (up to 100K events/month, 3 sites, 6 months retention). Can migrate
  to self-hosted Umami if retention or event limits become a concern.
- The Umami script is blocked by most ad blockers; reported numbers will under-count actual
  usage. This is acceptable for a personal productivity tool.
- No GDPR consent banner needed: Umami does not use cookies or fingerprinting.
