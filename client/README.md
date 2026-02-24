# Client (Web)

React + Vite web client with Colyseus networking, zustand state, and three.js rendering via `@react-three/fiber`.

## Commands
```bash
npm run dev
npm run build
npm run preview
```

## UX flow
- Shows phase/timer/sessionHp/gold.
- Character select buttons.
- Card purchase row (handles rejected actions).
- Battle text log and visual event playback queue.

## Troubleshooting white screen
- Open browser DevTools Console first.
- If server is down/unreachable, UI now shows `Connection error: ...` banner.
- Ensure server is running on `ws://localhost:2567` or set `VITE_COLYSEUS_URL`.
- If Network/WebSocket look healthy but page is visually blank, hard-refresh (`Ctrl+F5`) to clear stale CSS/JS cache.
