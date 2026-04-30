# Project conventions for AI agents

## Stack

- React 19 + TypeScript + Vite (SWC)
- Redux Toolkit (RTK) for state management
- Tailwind CSS v4 (CSS-first — no `tailwind.config.js`)
- oxlint + oxfmt for linting and formatting
- Vitest for unit tests, Playwright for E2E

## File and folder naming

- Use **lowercased-kebab-case** for all file and folder names.
    - Good: `task-item.tsx`, `list-of-lists.tsx`, `ui/`, `controls/`
    - Bad: `TaskItem.tsx`, `ListOfLists.tsx`, `UI/`, `Controls/`

## Comments

- Prefer `//` line comments over `/* */` block comments.
- Keep comments short and direct.
    - Good: `// Preload from localStorage`
    - Bad: `// ── Preload from localStorage ──────────────────────────────────────────────────`
- Avoid decorative separators (`//──`, `// ===`, `// ---`).

## Component props

- Name props interfaces `<ComponentName>Props`.
    - Good: `interface TaskItemProps { ... }`
    - Bad: `interface Props { ... }`, `interface ITaskItemProps { ... }`

## Modules

- Prefer ES modules (`import`/`export`) over CommonJS (`require`/`module.exports`).
- Prefer named exports over default exports.
    - Good: `export function App() { … }`, `export const store = …`
    - Bad: `export default function App() { … }`, `export default store`

## TypeScript

- Prefer `import type` for type-only imports.
- Avoid `any` — use `unknown` + narrowing, or `as unknown as T` when casting across incompatible types.
- Use `as const` for static option arrays.

## State management

- All global state lives in RTK slices under `src/store/slices/`.
- Selectors are co-located in the slice file where possible.
- Use `useAppDispatch` and `useAppSelector` (typed wrappers in `src/store/hooks.ts`).

## i18n

- Use `useT()` in components; never call `createTranslator` directly inside components.
- Add new keys to **all** locale catalogs — the TypeScript type is inferred from the English catalog.

## Commands

- `pnpm run dev` — start dev server
- `pnpm run typecheck` — TypeScript type check
- `pnpm run check` — TypeScript type + lint + format check
- `pnpm run fix` — lint + format fix
- `pnpm run test` — unit tests
- `pnpm run test:e2e` — Playwright E2E tests
- `pnpm run build` — production build
