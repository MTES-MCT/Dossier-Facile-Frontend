# AGENTS.md

## Cursor Cloud specific instructions

### Overview

DossierFacile is a French government monorepo (pnpm workspaces) containing 4 Vue 3 + Vite frontend apps and a shared component library. See `README.md` for general project documentation.

### Services

| App | Port | Command | Notes |
|-----|------|---------|-------|
| www (homepage) | 9001 | `pnpm --filter www dev` | Public pages, blog, SSG. Renders fully without backend. |
| tenantv3 (tenant) | 9002 | `pnpm --filter tenantv3 dev` | Requires Keycloak + backend API to display content. |
| owner (proprietaire) | 3000 | `pnpm --filter owner dev` | Requires Keycloak + backend API to display content. |
| watermark (FiligraneFacile) | 9184 | `pnpm --filter watermark dev` | Standalone watermark tool. Renders without backend. |

### Environment files

Each app needs a `.env.local` copied from `.env.example`:
```
cp www/.env.example www/.env.local
cp tenantv3/.env.example tenantv3/.env.local
cp owner/.env.example owner/.env.local
cp watermark/.env.example watermark/.env.local
```

### Lint, test, and type-check

- **Lint:** `pnpm --filter <app> lint` (ESLint with `--fix`). Note: `watermark` lint fails because `eslint` is not in its direct devDependencies (pre-existing issue).
- **Unit tests:** `pnpm --filter <app> test:unit -- --run` (Vitest). Tests exist in `df-shared-next`, `tenantv3`, `www`, and `owner`.
- **Type-check:** `pnpm --filter <app> tsc`
- **E2E tests:** `pnpm --filter e2e-tests test` (Cypress, requires all apps + backend running).

### Gotchas

- The `tenantv3` and `owner` apps render blank pages without a running Keycloak SSO server and backend API (separate repo: `dossierfacile-backend`). This is expected.
- The `www` and `watermark` apps render fully without any backend dependency.
- The pnpm install emits a warning about `vue-demi` ignored build scripts. This is controlled by `pnpm.onlyBuiltDependencies` in root `package.json` and does not affect functionality.
- Pre-existing ESLint errors exist in `df-shared-next` and `tenantv3` (unused variables, `no-explicit-any`). These are not regressions.
