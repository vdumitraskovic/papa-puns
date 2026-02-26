# AGENTS.md

Minimal guidance for coding agents working in `papa-puns`.

## Project

- This repo is an Expo + React Native app.
- Purpose: fetch jokes from an API and show them to users.
- Main app file: `App.js`.
- API logic: `api.js`.
- Local cache logic: `cache.js`.

## Commands

Use `package.json` scripts first:

- `npm run start` - start Expo dev server.
- `npm run android` - run Android app.
- `npm run ios` - run iOS app.
- `npm run web` - run web target.

Optional export commands:

- `npx expo export --platform web`
- `npx expo export`

## Environment

- API base URL comes from `EXPO_PUBLIC_API_URL` in `api.js`.
- Keep env values in `.env.local`.
- Never commit local env/secret files.

## Code Style

- JavaScript only (no TypeScript setup).
- Use semicolons and double quotes.
- Prefer `const`; use `let` only when reassignment is needed.
- Keep imports at the top; external imports first, then local imports.
- Components use PascalCase; functions/variables use camelCase; constants use UPPER_SNAKE_CASE.
- Keep async/network/storage code wrapped in `try/catch`.
- Prefer user-friendly error messages in UI.
- Keep API concerns in `api.js` and storage/date-key logic in `cache.js`.
- Use existing React Native patterns (`useEffect`, memoized callbacks, `StyleSheet.create`).

## Repo Hygiene

- Keep changes focused and minimal.
- Do not edit `node_modules/`.
- Follow existing project patterns unless a refactor is requested.

## Agent Rule Files

Current checks in this repo:

- No `.cursorrules` file.
- No `.cursor/rules/` files.
- No `.github/copilot-instructions.md` file.

If any of these are added later, treat them as higher-priority instructions.
