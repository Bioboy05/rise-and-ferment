# Rise & Ferment

Mobile-first sourdough companion app built with React + Vite.

## Quick start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Quality checks

Run the full local quality gate before pushing:

```bash
npm run qa
```

It runs:
- `lint` (ESLint rules, React hooks safety)
- `build` (production compile)
- `qa:personas` (scenario checks for beginner and power-user flows, plus data safety checks)

Optional encoding cleanup for locale files:

```bash
npm run qa:encoding
```

## Project structure

- `src/pages`: screen-level UI
- `src/components`: reusable UI components
- `src/store`: Zustand state stores
- `src/i18n`: translations and i18n setup
- `src/utils`: pure helpers and sanitization
- `src/constants`: shared constants
- `tasks`: maintenance and QA scripts

## Architecture notes

- i18n resources are merged with English fallback in `src/i18n/index.js`.
- User-imported backup data is sanitized before writing to local storage.
- All controlled HTML rendering goes through `sanitizeLimitedHtml` in `src/utils/sanitizeHtml.js`.
- Vite build uses manual chunks in `vite.config.js` to keep bundles easier to tune.

## Security baseline

- Starter and settings imports are normalized and clamped.
- Backup import rejects invalid/malformed content.
- UI HTML insertion is allowlist-based (small allowed tags set only).

## Editing guide

When adding features:

1. Keep UI text in locale files under `src/i18n/locales`.
2. Keep business logic in `src/utils` or `src/store`, not inline in page render.
3. Run `npm run qa` before commit.

