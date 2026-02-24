# Session Auto-Battler MVP

Monorepo with authoritative Colyseus server and web React client (Vite + three.js).

## Critical install rule (important)
This repository is a **workspace monorepo**. You must run dependency install from the **repo root**, not from `server/` or `client/` folders.

Correct:
```bash
npm install
```
from `/workspace/Game_dev_sandbox`.

If you run `npm install` inside `server`, npm will try to fetch `@autobattler/shared` from public registry and fail.

## NPM compatibility note
If your npm is old and throws `EUNSUPPORTEDPROTOCOL` for `workspace:*`, update npm or use this repo revision where local shared dependency is linked via `file:../shared`.

Recommended versions:
- Node.js 18+ (or 20+)
- npm 8+ (npm 10 recommended)

Check versions:
```bash
node -v
npm -v
```

## Architecture
- `shared`: protocol, enums, and type contracts used by both sides.
- `server`: authoritative room/state machine, schema state, RNG, card/ability engines, tick combat, and tests.
- `client`: Colyseus client + zustand store + battlelog visual queue + three.js scene.

## Run
```bash
npm install
npm run -w shared build
npm run -w server dev
```
In another terminal:
```bash
npm run -w client dev
```
Set `VITE_COLYSEUS_URL=ws://<host>:2567` if running server on another host.

If client shows blank/white page, check browser console and connection banner in UI; most often the Colyseus server is not reachable.

## Gameplay rules (CONFIG defaults)
- 8 players, ready required.
- Phases: `CHARACTER_SELECT -> CHOICE -> BATTLE -> ROUND_RESULT` loop.
- HP layers: `battleHp` in-combat and `sessionHp` across rounds.
- Session loss per defeat: `5`.
- Gold: start `3`, round gain `1`, cap `10`.
- Card cost: `3`.
- Mana: max `100`, regen `10/sec`, ult auto-casts and resets mana to `0`.

## Privacy and authority
- Public state only in Colyseus Schema (`MatchState`).
- Private card offers are sent with direct messages (`offers:cards`, `state:private`).
- Client never computes outcomes; it only renders streamed `battle:log`.

## Notes
- Client uses web `@react-three/fiber` + `three` to visualize battle-log events.
- All random decisions come from seeded server RNG (`state.seed` exposed for debugging).
