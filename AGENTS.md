# Repository Guidelines

These notes align contributors on how to work in this project.

## Project Structure & Module Organization
- `src/` holds all TypeScript sources; `index.ts` wires the user-script entry, `browser-scraper.ts` hosts runtime helpers, and `scrapers/` contains site-specific scrapers with paired `.e2e.ts` snapshots.
- `docs/` contains the published `scraper.user.js*` payload served via GitHub Pages; regenerate only through the release flow.
- `dist/` is throwaway build output; never edit by hand, and git-ignore any experimental artifacts.
- `types/` stores generated declaration files shipped to consumers; refresh with `npm run build:typings` before publishing.
- `screenshots/` captures UX references; keep filenames descriptive and update when UI changes.

## Build, Test, and Development Commands
- `npm run build` (or `just build`) bundles the userscript into `dist/` using `build.ts`.
- `npm run prod:build` creates the production userscript; run before tagging releases.
- `npm run check-types` performs a strict `tsc --noEmit`.
- `npm run lint` and `npm run check-fmt` enforce ESLint and Prettier; `npm run fmt` applies formatting fixes.
- `just e2e` executes Chromium-backed E2E tests via `tsx`; use `just e2e-only` while iterating and `just e2e-update-snapshots` when intentional DOM changes affect snapshots.

## Coding Style & Naming Conventions
- Follow TypeScript ES modules, 2-space indentation, and trailing commas where Prettier emits them.
- Prefer standalone pure functions over classes; keep scraper logic per site under `src/scrapers/<site>.ts`.
- Use `camelCase` for variables and functions, `PascalCase` for types, and `kebab-case` filenames for new modules.
- Keep side effects inside `index.ts` or dedicated UI glue; utility modules should be deterministic and dependency free.
- Run `npm run lint` before pushing to catch unused exports or implicit `any`.

### Site-Specific Notes
- Yakaboo: the product attributes accordion now renders through `[data-testid="char-toggler"]`; fall back to the legacy `.main__chars button.ui-btn-nav` selector and treat `aria-expanded`/`aria-pressed` or `Приховати` as the expanded signal.

## Testing Guidelines
- Tests live beside implementations as `*.e2e.ts`; pair each with a `.snapshot` file checked in.
- Ensure Chromium is available on PATH; override with `CHROMIUM_PATH=/path/to/chromium just e2e`.
- Name tests after the user journey they assert and prefer `testContext` helpers from `src/test-utils.ts`.
- Update snapshots only when output changes are intentional and reviewed; keep failures reproducible by seeding data or mocking network calls.

## Commit & Pull Request Guidelines
- Use present-tense, imperative commit subjects (`add imdb scraper metadata`, `bump to 2.11.0`) and keep body text focused on rationale.
- Group related changes into single commits; avoid mixing feature work with formatting churn.
- PRs must describe the change, list verification steps (`just e2e` outputs, manual browser checks), and attach fresh UI screenshots when visuals shift.
- Link relevant issues or release tickets, note breaking changes explicitly, and confirm types/lint/test commands have been run.
