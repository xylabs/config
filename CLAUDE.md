# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

The **shared build toolchain** for all XY Labs / XYO Network TypeScript projects. Changes here affect every downstream consuming repo — exercise extra caution.

## Build Commands

```bash
# Bootstrap ts-scripts-yarn3 first (required before any other build)
yarn workspace @xylabs/ts-scripts-yarn3 package-compile

# Full build (clean → compile → lint → deplint)
yarn build

# Compile all packages
yarn compile

# Clean all build artifacts
yarn clean
```

## Deploy / Publish

```bash
# Never bump versions manually — always use these:
yarn deploy-patch   # bump all packages patch → build → apply versions
yarn deploy-minor
yarn deploy-major

# Publish to npm after deploying
yarn publish-all    # npm publish --workspaces
```

## Linting / Fixing

```bash
# Lint all packages via the xy CLI
yarn xy lint

# Check dependency declarations (deplint)
yarn xy deplint

# Fix lint issues automatically
yarn xy fix

# Check for circular dependencies
yarn xy cycle
```

## Package-level Scripts

Each package runs its own compile via:
```bash
yarn workspace <package-name> package-compile
```

## Architecture

See [architecture.md](./architecture.md) for detailed architecture documentation covering package structure, dependency graph, the `xy` CLI command system, ESLint config composition, build pipeline, and how downstream projects consume this toolchain.

### Key Points

- `@xylabs/ts-scripts-yarn3` must compile **first** (provides the `xy` CLI for all other packages)
- All packages share a single version — never edit `"version"` fields manually
- Packages compile via `tsup` (bundled ESM output to `dist/`)
- The `xy` CLI is composed by chaining yargs command groups (`xyBuildCommands`, `xyLintCommands`, `xyDeployCommands`, `xyInstallCommands`, `xyCommonCommands`)
