# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code skill for managing Linear issues, projects, and teams. It provides a CLI, SDK utilities, and GraphQL query tools that wrap the `@linear/sdk` package. Scripts run directly via `tsx` (no compilation step).

## Common Commands

```bash
npm run typecheck          # TypeScript validation (tsc --noEmit)
npm run lint               # ESLint check
npm run lint:fix           # ESLint auto-fix
npm run setup              # Validate environment (API key, dependencies)
npm run test-connection    # Integration test: verify LINEAR_API_KEY works
```

Run individual scripts with `npx tsx`:

```bash
npx tsx scripts/linear-ops.ts <command> [args]   # Main CLI (20+ commands)
npx tsx scripts/query.ts "<graphql>"             # Raw GraphQL queries
npx tsx scripts/sync.ts --issues ENG-1,ENG-2 --state Done  # Bulk updates
npx tsx scripts/upload-image.ts <issue-id> <image-path>    # Image upload
```

There is no test framework — CI runs only `typecheck` and `lint`.

## Architecture

**Layered design**: CLI scripts → shared library → `@linear/sdk` → Linear GraphQL API

- **`SKILL.md`** — Entry point discovered by Claude Code. Defines tool permissions, workflows, and conventions. This is the authoritative source for skill behavior.
- **`scripts/linear-ops.ts`** — Main CLI router with commands for issues, projects, initiatives, labels, and updates.
- **`scripts/lib/`** — Shared utilities:
  - `linear-utils.ts` — SDK client init (`getLinearClient()`), entity lookups (project, team, initiative)
  - `taxonomy.ts` + `taxonomy-data.ts` — Label type definitions and color/category data
  - `taxonomy-validation.ts` — Label validation rules and suggestion logic
  - `labels.ts` — Label CRUD operations against Linear API
  - `agent-selection.ts` — Routes domain labels to agent specialties
  - `initiative.ts` — Initiative linking with `LINEAR_DEFAULT_INITIATIVE_ID` support
  - `project-template.ts` — Standardized project creation with mandatory steps
  - `verify.ts` — Post-creation verification
  - `exit-codes.ts` — Standard exit codes for all scripts
  - `index.ts` — Public API re-exports
- **`scripts/query.ts`** — Direct GraphQL executor using `LinearClient.rawRequest()`
- **`scripts/sync.ts`** — Bulk status updates for issues/projects

**Supplementary docs** (referenced from SKILL.md): `api.md` (GraphQL), `sdk.md` (SDK patterns), `projects.md` (project/initiative management), `sync.md` (bulk operations), `troubleshooting.md`, `docs/labels.md` (taxonomy).

## Mandatory Conventions

These are enforced by the skill and project-template code:

- Every **project** must link to an initiative
- Every **issue** must have exactly one **Type** label (`feature`, `bug`, `refactor`, `chore`, `spike`)
- Projects must set both `description` (max 255 chars) and `content` (unlimited markdown)
- Discovery-before-creation: always search for existing entities before creating new ones
- Post-creation verification is built into `project-template.ts`

## Label Taxonomy

Three categories defined in `scripts/lib/taxonomy-data.ts`:

| Category | Cardinality | Examples |
|----------|-------------|---------|
| Type | exactly 1 | `feature`, `bug`, `refactor`, `chore`, `spike` |
| Domain | 1–2 | `security`, `performance`, `infrastructure`, `frontend`, `backend`, `mcp`, `cli` |
| Scope | 0–2 | `breaking-change`, `tech-debt`, `blocked`, `needs-split` |

Domain labels drive agent routing via `agent-selection.ts`.

## Environment

- `LINEAR_API_KEY` (required, `lin_api_*` prefix, sensitive) — set in `.env`, shell profile, or `~/.claude/.env`
- `LINEAR_DEFAULT_INITIATIVE_ID` (optional) — default initiative UUID for `createProject()`
- `.env.schema` defines variable types for Varlock integration

## Commit Convention

Semantic-release parses commit messages: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Breaking changes use `feat!:` or `BREAKING CHANGE:` in body.

## ESLint Config

ESLint 9 flat config in `eslint.config.js`. Targets `scripts/**/*.ts`. `no-explicit-any` and `no-unused-vars` are warnings (unused vars prefixed with `_` are ignored).
