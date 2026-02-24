# Session Auto-Battler MVP

Monorepo with authoritative Colyseus server and Expo React Native client.

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
npm run -w client start
```
Set `EXPO_PUBLIC_COLYSEUS_URL=ws://<host>:2567` for device testing.

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
- Client uses `@react-three/fiber/native` + `three` to visualize battle-log events.
- All random decisions come from seeded server RNG (`state.seed` exposed for debugging).
