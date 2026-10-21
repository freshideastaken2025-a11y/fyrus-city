# Fyrus City — https://fyrus.io

- `index.html` — the whole city (single-file build).
- `fyrus-plus.js` — add-on layer loaded after the city: mood/weather picker on entry, visa-free Citizen ID card from a photo, Museum of 2026, neon free-plot construction sites, cinematic view. Uses `window.__fyrus` and `window.__fyrusW`.
- `server.mjs` — Node server: serves the site, live multiplayer over WebSocket (`/ws`), city chat, DMs, groups, Fyrus phone numbers, voice-call signalling, shared land ownership and AI translation.
- `Dockerfile` — `node:22-alpine`, port 80.

Coolify settings: persistent storage mounted at `/data` (keeps users, chats and plots across deploys). Optional env `ANTHROPIC_API_KEY` turns on chat translation (`ANTHROPIC_MODEL` defaults to `claude-haiku-4-5`).
