# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Shukufa" — a flower shop storefront + admin panel. Nuxt 4 (Vue 3, TypeScript) frontend consuming a separate backend REST API (Go-style JSON envelope). No local database or server routes — this repo is purely the frontend client.

## Commands

```bash
npm run dev       # dev server on http://localhost:3000
npm run build     # production build
npm run generate  # static generation
npm run preview   # preview production build locally
```

There is no lint script, no test runner, and no `postinstall` beyond `nuxt prepare` configured in this repo — don't assume `npm run lint`/`npm test` exist.

Docker: `docker-compose.yml` builds `Dockerfile` (multi-stage, `node:22-alpine`) and runs the frontend on port 3000, reading env vars from `.env`. Deploys automatically via `.github/workflows/deploy.yml` on push to `main` (SSH into the server, `git pull` + `docker compose up -d --build`).

## Environment

Runtime config in `nuxt.config.ts`:
- `NUXT_API_BASE_SERVER` — API base URL used for **server-side** (SSR) requests, defaults to `http://host.docker.internal:8080`.
- `NUXT_PUBLIC_API_BASE` — API base URL used for **client-side** requests, defaults to `http://localhost:8080/api/v1`.
- `NUXT_SESSION_PASSWORD` — required by `nuxt-auth-utils`.

## Architecture

The `app/` directory follows Nuxt 4's `srcDir` convention. Feature code is organized by domain, not by layer:

- `composables/catalog/` (`useProducts`, `useCategories`, `useEvents`) and `composables/identity/` (`useAuth`) — thin wrappers around `useApi()` that define request/payload types and call specific endpoints. These do not hold state.
- `stores/catalog/` and `stores/identity/` (Pinia, configured via `pinia.storesDirs: ["./stores/**"]`) — hold state and caching logic, call the composables above. This composable → store split is consistent across every domain; follow it for new features.
- `stores/commerce/cart.ts` is the API-backed cart store and follows the same composable → store split as every other domain.

### API layer (`composables/useApi.ts`)

Single `useApi()` composable is the only place `$fetch` is called. Key behaviors to preserve when touching it:
- Picks `baseURL` per-environment: `config.apiBaseServer` during SSR, `config.public.apiBase` on the client.
- Unwraps the backend's `ApiEnvelope<T>` (`{ data, error, message }`) and returns `.data` directly — callers get `T`, not the envelope.
- Auth: reads/sends the bearer token from `useAuthToken()` (cookie-based, so it works in both SSR and client).
- On `401` (not itself a retry, not `/auth/login` or `/auth/refresh`): deduplicates concurrent refresh attempts via a module-level `refreshPromise`, retries the original request once after a successful refresh, otherwise clears tokens and redirects to `/auth/login`.
- On `500`: clears tokens and redirects to `/`.
- Errors are surfaced via `useNotify()` (toast) with i18n-translated messages, and thrown as typed `ApiError` (`types/api.ts`) unless `opts.silent` is set.
- `upload()` sends `FormData` (used for multipart product image uploads) — see `composables/catalog/useProducts.ts::create` for the FormData-building pattern.

### Auth & route protection

- `useAuthToken()` stores `access_token`/`refresh_token` in cookies (works SSR + client).
- `stores/identity/auth.ts` (`useAuthStore`) holds the current `user` and an `initialized` flag; `isAuthenticated`/`isAdmin` are getters off `user`.
- `plugins/auth.client.ts` calls `fetchMe()` once on client boot so auth state is ready before route guards run.
- Middleware in `middleware/`: `auth.ts` (must be logged in), `admin.ts` (must be logged in **and** admin), `guest.ts` (must be logged out, e.g. for login/register pages), and `route-guard-global.ts` (registered globally — same admin check, gates any `/admin/*` path automatically). Each middleware lazily calls `authStore.fetchMe()` if not yet `initialized` before checking.

### i18n

`@nuxtjs/i18n` with three locales: `uz` (default, `prefix_except_default` strategy so `uz` has no URL prefix), `eng`, `ru`. Translation files live in `i18n/locales/*.json`. `useApi()` pulls status-code error strings from the `api.*` translation keys — when adding new API error handling, add matching keys to all three locale files.

### Forms

Admin CRUD forms (`ProductFormModal.vue`, `CategoryFormModal.vue`, `EventFormModal.vue`) validate with `zod` schemas under `app/schemas/` (see `schemas/product.ts` for the pattern: camelCase form fields, `superRefine` for cross-field validation, exported `FormValues`/`FormErrors` types). Backend payload field names are snake_case (see `CreateProductPayload` in `useProducts.ts`) — form → payload mapping happens in the modal components, not the schema.

### UI

`@nuxt/ui` (v4) is the component library; `colorMode` is pinned to light only (no dark mode). Icons come from `@iconify-json/lucide` and `@iconify-json/simple-icons`. Global styles in `app/assets/css/main.css` and `variables.css`.

### Comments

Existing inline comments in this codebase are written in Uzbek and explain *why*, not *what* (e.g. race-condition guards, SSR-context caveats). Match that style — keep new comments sparse and non-obvious, in Uzbek, consistent with the surrounding file.
