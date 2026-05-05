# Task 001 — Browser Notifications on Timer Completion

## Goal

When a Pomodoro or Break timer ends, send a system-level notification via the Web Notifications API, so the user is alerted even when the tab is in the background or the system volume is low.

## Technical Feasibility

The [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) is a browser standard supported across all major platforms. The browser delegates to the OS notification system — macOS Notification Center, KDE/GNOME notifications on Linux, and Windows toast notifications — so it works everywhere without platform-specific code.

Requirements:

- The user must grant notification permission (one-time browser prompt).
- The page must be served over HTTPS or localhost (already satisfied).
- Works whether the tab is in the foreground or background; requires the browser to be running.

## Behavior

### Permission request

- On first use, request notification permission via `Notification.requestPermission()`.
- Permission is requested lazily — only when the first timer session starts (`startStop()` is called while resuming/starting), not on page load.
- If permission is `denied`, silently skip notifications (no error shown to user).

### Notification trigger

- Fire one notification the moment a timer session completes (i.e., when `dingCount === 0` and `state.done === true`).
- Do **not** repeat the notification on subsequent dings of the same session.

### Notification content

| Timer type | Title          | Body                        |
|------------|----------------|-----------------------------|
| Focus      | "Focus ended"  | "Time for a break!"         |
| Break      | "Break ended"  | "Ready to focus?"           |

- Icon: the app favicon (`/favicon.ico` or the PWA icon).

## Interface / Contract

New utility function in `src/utils/pomodoro.ts`:

```ts
export function sendTimerNotification(type: 'L' | 'S'): void
```

- Checks `Notification.permission === 'granted'` before sending.
- Creates `new Notification(title, { body, icon })`.

New function in `Pomodoro.vue`:

```ts
async function requestNotificationPermission(): Promise<void>
```

- Calls `Notification.requestPermission()` if permission is `'default'`.
- Called once from `startStop()` when transitioning from paused/initial to running.

## Validation Rules

- Guard against browsers that do not support the Notifications API (`'Notification' in window`).
- Do not request permission on page load — only on user interaction.
- If permission is `'denied'`, do nothing (no UI change required).

## Error Cases

- API not supported → skip silently.
- Permission denied → skip silently.
- `Notification` constructor throws → catch and ignore.

## Out of Scope

- A settings toggle to enable/disable notifications (can be added later).
- Notification click action (can be added later).
