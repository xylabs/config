# Architecture

This document describes the architecture of the `@xylabs/config` monorepo — the shared build toolchain for all XY Labs / XYO Network TypeScript projects.

## Repository Structure

```
config/
  packages/
    ts-scripts-yarn3/       # Core toolchain — the `xy` CLI
    ts-scripts-react-yarn3/ # React-specific `xy` CLI extensions
    eslint-config-flat/     # Base ESLint flat config
    eslint-config-react-flat/ # React ESLint addon
    tsconfig/               # Base TypeScript config
    tsconfig-dom/           # DOM-augmented TypeScript config
    tsconfig-react/         # React TypeScript config
```

## Package Dependency Graph

```
tsconfig-react
  -> tsconfig-dom
       -> tsconfig

eslint-config-react-flat
  -> eslint-config-flat

ts-scripts-react-yarn3
  -> ts-scripts-yarn3
```

All compilable packages depend on `@xylabs/tsconfig` for TypeScript configuration and `@xylabs/ts-scripts-yarn3` for build tooling (as a devDependency).

## Packages in Detail

### `@xylabs/ts-scripts-yarn3`

The core of this repo. Provides the `xy` CLI binary and all `package-*` bin scripts used by every downstream project.

**Entry point:** `src/bin/xy.ts` — invokes `xy()` from `src/xy/xy.ts`.

**CLI composition:** The `xy` CLI is built by chaining yargs command groups in a functional pipeline:

```
xyParseOptions() -> xyLintCommands -> xyDeployCommands -> xyInstallCommands -> xyCommonCommands -> xyBuildCommands
```

Each command group is defined in `src/xy/xy*.ts` and delegates to action implementations in `src/actions/`.

#### Command Groups

| Group | File | Commands |
|---|---|---|
| **Build** | `xyBuildCommands.ts` | `build`, `compile`, `compile-only`, `recompile`, `rebuild`, `copy-assets` |
| **Lint** | `xyLintCommands.ts` | `lint`, `fix`, `relint`, `deplint`, `cycle`, `publint`, `knip`, `sonar` |
| **Deploy** | `xyDeployCommands.ts` | `deploy`, `deploy-minor`, `deploy-major`, `deploy-next`, `publish` |
| **Install** | `xyInstallCommands.ts` | `clean`, `reinstall`, `up`, `updo`, `statics`, `dupdeps` |
| **Common** | `xyCommonCommands.ts` | `license`, `dead`, `gen-docs`, `clean-docs`, `gitlint`, `gitignore-gen`, `npmignore-gen`, `test`, `retest`, `upplug`, `upyarn`, `yarn3only` |

#### Package-level Binaries

In addition to the `xy` CLI, the package exports individual `package-*` binaries (defined in `src/bin/package/`) that are invoked per-workspace during builds:

`package-compile`, `package-build`, `package-clean`, `package-lint`, `package-fix`, `package-cycle`, `package-publint`, `package-recompile`, `package-relint`, `package-gen-docs`, `package-copy-assets-cjs`, `package-copy-assets-esm`, `package-clean-outputs`, `package-clean-typescript`, `package-build-only`, `package-compile-only`, `package-lint-verbose`

#### Key Libraries (`src/lib/`)

| Module | Purpose |
|---|---|
| `yarn/` | Yarn version detection, workspace discovery (`yarnWorkspace.ts`, `yarnWorkspaces.ts`) |
| `dependencies/` | Duplicate dependency detection |
| `file/` | File reading utilities, line parsing |
| `processEx.ts` | Process execution helpers |
| `runXy.ts` / `runXyWithWarning.ts` | Helpers for invoking `xy` sub-commands |
| `runStepsAsync.ts` | Sequential async step runner |
| `createBuildConfig.ts` / `defaultBuildConfig.ts` | Build configuration (tsup options) |
| `deleteGlob.ts` | Glob-based file deletion for clean operations |

#### Deplint (`src/actions/deplint/`)

A custom dependency linter that verifies `package.json` declarations match actual imports:
- Scans source files for external imports
- Compares against declared `dependencies`, `devDependencies`, and `peerDependencies`
- Reports unused or undeclared dependencies

#### Configuration Loading

`src/loadPackageConfig.ts` reads `package.json` from `INIT_CWD` (set by Yarn when running package scripts), allowing package-level binaries to know which workspace they're operating on.

### `@xylabs/ts-scripts-react-yarn3`

Extends the base `xy` CLI with React-specific build behavior. Provides its own `xy` and `package-*` binaries that wrap and extend the base toolchain. Depends on `@xylabs/ts-scripts-yarn3` at runtime.

### `@xylabs/eslint-config-flat`

ESLint flat config composed from modular sub-configs in `src/`:

| Sub-config | Source directory | Description |
|---|---|---|
| `typescriptConfig` | `src/typescript/` | TypeScript-specific rules via `@typescript-eslint` |
| `unicornConfig` | `src/unicorn/` | Unicorn plugin rules |
| `workspacesConfig` | `src/workspaces/` | Monorepo workspace rules |
| `rulesConfig` | `src/rules/` | General and `@stylistic` rules |
| `importConfig` | `src/import/` | Import ordering and resolution (`eslint-plugin-import-x`, `simple-import-sort`) |
| `markdownConfig` | `src/markdown/` | Markdown file linting |
| `sonarConfig` | `src/sonar/` | SonarJS rules (opt-in) |
| `jsonConfig` / `jsoncConfig` / `json5Config` | `src/json/` | JSON file linting (opt-in) |

**Default export** (`config`): includes `markdown`, `typescript`, `unicorn`, `workspaces`, `rules`, and `import` configs.

**Consumer usage:**
```ts
// Use full default config
import { config } from '@xylabs/eslint-config-flat'

// Or compose selectively
import { typescriptConfig, importConfig, rulesConfig } from '@xylabs/eslint-config-flat'
export default [typescriptConfig, importConfig, rulesConfig]
```

### `@xylabs/eslint-config-react-flat`

Extends `@xylabs/eslint-config-flat` with React-specific rules using `eslint-plugin-react-*` plugins (`react-x`, `react-dom`, `react-hooks-extra`, `react-refresh`, `react-naming-convention`, `react-web-api`).

### `@xylabs/tsconfig`

Base TypeScript configuration. Key settings:
- **Target:** ESNext
- **Module:** NodeNext (with NodeNext resolution)
- **Strict mode** enabled
- **noEmit:** true (compilation is handled by tsup, not tsc)
- **ESM-first:** `allowImportingTsExtensions`, `isolatedModules`
- **Decorators:** `experimentalDecorators` + `emitDecoratorMetadata`

### `@xylabs/tsconfig-dom`

Extends `@xylabs/tsconfig`, adds DOM and DOM.Iterable to `lib` for browser-targeted packages.

### `@xylabs/tsconfig-react`

Extends `@xylabs/tsconfig-dom`, adds `"jsx": "react-jsx"` for React projects.

## Build Pipeline

### Bootstrap Order

`@xylabs/ts-scripts-yarn3` must compile **first** because it provides the `xy` CLI and all `package-*` binaries. The root `yarn compile` handles this:

```
1. yarn workspace @xylabs/ts-scripts-yarn3 package-compile  (tsup directly)
2. yarn workspaces foreach -Apt --exclude @xylabs/ts-scripts-yarn3 run package-compile
```

### Compilation

All packages compile via **tsup** producing bundled ESM output to `dist/`. The `ts-scripts-yarn3` package calls tsup directly; other packages invoke `package-compile` which delegates through the xy CLI toolchain.

### Full Build (`yarn build`)

```
clean -> compile -> lint -> deplint
```

### Versioning and Deploy

All packages share a single version (currently 7.3.2). The deploy workflow uses Yarn's deferred versioning:

```
1. yarn workspaces foreach --all version <patch|minor|major> --deferred
2. yarn build
3. yarn version apply --all
```

Never edit `"version"` fields manually.

### Publishing

```
yarn publish-all  # runs npm publish --workspaces
```

## How Downstream Projects Consume This

A typical consuming repo:
1. Lists `@xylabs/ts-scripts-yarn3` (or `react` variant) as a devDependency for `xy` CLI and `package-*` scripts
2. Extends `@xylabs/tsconfig` (or `dom`/`react` variant) in its `tsconfig.json`
3. Imports from `@xylabs/eslint-config-flat` (or `react` variant) in its `eslint.config.mjs`
4. Runs `yarn xy build`, `yarn xy lint`, etc. in CI and locally
