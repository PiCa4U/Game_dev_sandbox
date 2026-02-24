# Server

Authoritative Colyseus server.

## Commands
```bash
npm run dev
npm run test
npm run build
```

## Implemented protocol
Client->Server: `matchmaking:join`, `client:ready`, `character:select`, `card:pick`.
Server->Client: `matchmaking:queued`, `matchmaking:matched`, `phase:update`, `offers:cards`, `state:private`, `action:rejected`, `battle:log`, `round:result`, `match:ended`.
