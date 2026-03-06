# XY Labs - Architecture & Patterns

> Auto-managed by `yarn xy claude-rules`. Do not edit manually.

- Monorepo structure using Yarn workspaces
- Each package compiles to ESM via `tsup` (output to `dist/`)
- All packages in a repo share a single version - never edit version fields manually
- Use the `@xylabs/ts-scripts-yarn3` toolchain for building, linting, and deploying
- Follow the dependency inversion principle - depend on abstractions, not concretions
- Prefer composition over inheritance
- Keep packages small and focused on a single responsibility
