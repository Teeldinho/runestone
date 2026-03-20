# Runestone

Runestone is a 3D dungeon crawler where the dungeon architecture mirrors a live XState v5 machine.

## Stack

- TanStack Start + TanStack Router
- React 19.1
- TypeScript (strict)
- Tailwind v4
- Convex
- XState v5
- React Three Fiber + Rapier

## Scripts

```bash
nvm use
npm run dev
npm run build
npm run theme:sync
npm run theme:check
npm run lint:fix
npm run lint:fsd
npm run typecheck
npm run test
npm run ci:preflight
```

## Runtime

- Required: Node `22.12.0` and npm `11.5.1`.
- The repository includes `.nvmrc` and `.node-version` for automatic alignment in supported tooling.
- If you see `EBADDEVENGINES` warnings, switch to the project runtime with `nvm use`.

## Convex

```bash
npx convex dev --once
```

The project includes Convex local deployment setup and generated Convex AI guidelines in `convex/_generated/ai/guidelines.md`.
