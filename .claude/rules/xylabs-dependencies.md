# XY Labs - Preferred Dependencies

> Auto-managed by `yarn xy claude-rules`. Do not edit manually.

When a dependency is needed, prefer these packages:

| Purpose | Package |
|---|---|
| HTTP client | `axios` |
| Schema validation | `zod` |
| Logging | `@xylabs/logger` |
| Assert/invariants | `@xylabs/assert` |
| Async utilities | `@xylabs/promise` |
| Lodash replacements | `@xylabs/lodash` |
| React state | React hooks + context (avoid Redux) |
| React UI components | `@mui/material` (Material UI) |
| Styling | MUI `sx` prop and `styled()` - avoid CSS-in-JS libraries or raw CSS |
| Testing | `vitest` |
| Bundling | `tsup` (libraries), `webpack` (apps) |
| Linting | `eslint` with `@xylabs/eslint-config` |
| Shared XY Labs utilities | `@xylabs/sdk-js` |
| XYO application code | `@xyo-network/sdk-js` |
| XYO Layer 1 Protocol | `@xyo-network/xl1-sdk` |
| XYO Layer 1 Chain | `@xyo-network/chain-sdk` |
