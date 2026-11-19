# Christmas Gifts

A family gift-tracker + Secret Santa web app. Keep changes consistent with the
structure, naming, and conventions below.

## Stack

- **Framework**: SvelteKit 3 + Svelte 5 (runes: `$state`, `$derived`, `$props`, `$effect`)
- **Styling**: Open Props (`var(--size-*)`, `var(--surface-*)`, …) in component `<style>` blocks
- **Icons**: unplugin-icons — `import X from '~icons/chunk/name'`
- **Database**: Neon (Postgres) via `@neondatabase/serverless`; **ORM**: Drizzle
- **i18n**: Paraglide (`messages/en.json` + `messages/nl.json` → `src/lib/paraglide`)
- **UI sounds**: `@foleyjs/core` (see [Foley](#foley-ui-sounds))
- **Tests**: Vitest (`tests/`)

Import aliases: `#lib/*`, `#components/*`, `#db/*` (see `package.json` → `imports`).

## Structure

- `src/lib/db/schema/` — Drizzle tables (`user.ts`, `gift-item.ts`, …)
- `src/lib/db/remotes/` — **remote functions** (`$app/server`): `query`, `form`, `command`
- `src/lib/components/` — shared components (`Menu`, `*Modal`, `SizeChart`, …)
- `src/routes/` — pages. `(private)/` is behind login, `(auth)/` is public
- `src/lib/server/` — server-only helpers (`drizzle.ts`, `migrate.ts`)
- `drizzle/migrations/` — SQL migrations; `messages/` — Paraglide sources; `tests/` — Vitest

## Conventions

### Remote functions (`src/lib/db/remotes/`)

Client/server data flow goes through remote functions, never raw fetch.

- `query` / `query.batch` — read data; the client calls e.g. `getUser(id)` and reads
  `.current` / `.loading` / `.error`. Batch queries take the input argument on refresh
  (`getUser(user).refresh()`).
- `form` — mutations wrapped in a `<form>`; spread `{...fn.enhance(...)}` on **exactly
  one** `<form>` element. A remote form can only attach to a single form element —
  never spread `.enhance` inside an `{#each}`.
- `command` — mutations called directly from event handlers (`await fn(input)`), e.g.
  removes and quick toggles. Prefer when there is no natural form.
- Schemas are Zod; form schemas use `.optional()` (SvelteKit remote forms reject
  `null`-able input). Guard mutations with admin/family checks (`error(403, …)`).
- Session is cookie-based: `user` (uuid) + `family` (id). Cookie writes use
  `path: '/', secure: !dev, maxAge, expires`.
- This project uses the legacy `$app/env` module (`browser`, `dev`) — not
  `$app/environment` — and `$app/env/private` for server-only env vars.

### Database

- Schema lives in `src/lib/db/schema/`; migrate with `pnpm db:generate` (new) and
  `pnpm db:migrate` (apply). The latter needs env loaded:
  `set -a && source .env && set +a && pnpm db:migrate`.
- Applied migrations are tracked in `drizzle.__drizzle_migrations` — keep it in sync.

### i18n (Paraglide)

Every user-facing string goes through `m` (`#lib/paraglide/messages.js`) — never hardcode
text. Add keys to **both** `messages/en.json` and `messages/nl.json`, then recompile:

```sh
node_modules/.bin/paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide --strategy preferredLanguage baseLocale --emit-ts-declarations
```

### Success / error feedback

Every mutation flow reports its outcome through `confetti.success(msg)` /
`confetti.error(msg)` (from `src/routes/+layout.svelte`). That funnel also plays the
foley `success`/`error` cue, so new flows must use it rather than calling `play()`
directly for action outcomes.

### Email & notifications

Transactional emails go out via nodemailer (`src/lib/server/email.ts`), configured with
`SMTP_URL` (an `smtp(s)://` connection string) and `EMAIL_FROM` in `.env`. Both must
also be declared in `src/env.ts` (this project runs explicit env-var mode — undeclared
vars don't exist). With an empty `SMTP_URL`, emails are logged to the console instead of
sent, so the app never crashes on a missing mail server.

Send event emails through the typed helpers in `email.ts` (e.g. `sendInviteEmail(...)`) —
don't build raw transports in remotes. The admin-only invite flow
(`src/lib/db/remotes/members.remote.ts` + `/members` page) creates the user + family
membership, derives a unique username from the display name, emails the invitee their
username, and rolls the user row back if the mail send fails.

Email copy currently renders in the base locale (English); wire request-locale into the
paraglide server runtime if per-recipient language is ever needed.

### Foley (UI sounds)

UI sounds are synthesized with `@foleyjs/core` (no audio files), booted once in
`src/hooks.client.ts`:

```ts
set({ theme: 'soft', volume: 0.7, localize: 0.4 }); // global character
bind();    // interaction sounds (data-foley-hover/-press/-release/-click/-toggle/-type)
observe(); // appearance & state-change sounds (data-foley-enter/-exit/-change)
```

`bind()` and `observe()` are **delegated** — they cover markup rendered later (modals,
routes, list items), so you never re-bind. `observe()` only fires for changes **after**
the call, so the initial render is silent by design.

**Interaction attributes** (`bind()`), each takes a cue name to override the default:

| Attribute | Fires on | Default cue |
| --- | --- | --- |
| `data-foley-hover` | `pointerenter`, `focusin` | `tick` |
| `data-foley-press` | `pointerdown` | `press` |
| `data-foley-release` | `pointerup` | `release` |
| `data-foley-click` | `click` | `tap` |
| `data-foley-toggle` | `click` (reads `aria-pressed`) | `on` / `off` |
| `data-foley-type` | `keydown` (Enter → `complete`) | `thock` |

**Appearance & state** (`observe()`):

| Attribute | Fires when | Default cue |
| --- | --- | --- |
| `data-foley-enter` | element added to the DOM | `bubble` |
| `data-foley-exit` | element removed | `whoosh` |
| `data-foley-change` | a **state attribute** on it changes | `switch` |

`-change` watches only `aria-expanded`, `aria-selected`, `aria-checked`, `aria-pressed`,
`open`, `data-state` — never `class` (class churn would rattle the page).

**Codebase mapping** — match these when adding interactivity:

- Links (nav, external, payoff, link preview): `data-foley-hover data-foley-click`
- Buttons (submit, create, edit, remove, logout): `data-foley-press data-foley-release`
  (never add `-click` on the same element — three cues per click)
- Text inputs & textareas (modals, login, editable size chart): `data-foley-type`
- `<details>` (recipient groups on overview/ideas): `data-foley-change` (sounds on `open`)
- `<dialog>` modals: `data-foley-change="latch"` (one cue for open and close — a
  persistent `<dialog>` never mounts/unmounts, so `-enter`/`-exit` won't fire)
- Checkboxes / radios (purchased toggle, family selector): `data-foley-change` plus an
  `aria-checked` kept in sync by Svelte (don't use `-toggle` unless `aria-pressed`)
- Removable list rows (wish list, ideas, partners): `data-foley-exit` on the `<li>`
- `<select>`s: no foley (state attributes don't track selection)

**Cues** — Pointer: `tick hover glide pop` · Press: `press release tap thock` ·
Toggle: `on off switch latch` · Feedback: `success error warning denied` ·
Notify: `chime ping bell bubble` · Motion: `swoosh whoosh drop rise` ·
State: `loading ready complete sparkle`. Themes: `default | soft | mechanical | glass`.

Prefer bare attributes when the default cue fits; override with a named cue only when
the moment calls for it (e.g. a destructive action). No extra wiring or lifecycle code —
attributes are picked up by the existing delegated `bind()`/`observe()`.

## Commands

| Command | Action |
| --- | --- |
| `pnpm dev` | dev server |
| `pnpm check` | `svelte-check` type/`svelte` analysis (must be clean) |
| `pnpm test` | Vitest suite (must pass) |
| `pnpm build` | production build (must pass) |
| `pnpm db:generate` / `pnpm db:migrate` | new migration / apply pending (needs `.env`) |

Run all of `pnpm check`, `pnpm test`, and `pnpm build` after any change set.

## Svelte MCP tools

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
