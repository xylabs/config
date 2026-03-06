# XY Labs - Style & Formatting

> Auto-managed by `yarn xy claude-rules`. Do not edit manually.

- Use TypeScript strict mode for all source files
- Use ESM (`import`/`export`) exclusively - never use CommonJS (`require`/`module.exports`)
- Prefer `const` over `let`; never use `var`
- Use standard `function` declarations for all top-level functions, even short ones (e.g. `export function foo() { ... }`)
- Use arrow functions only for callbacks, inline arguments, and closures
- Use explicit return types on exported functions
- Use `interface` over `type` for object shapes when possible
- Prefer named exports over default exports
- Use template literals over string concatenation
- Use optional chaining (`?.`) and nullish coalescing (`??`) over manual checks
- Keep files focused and small - prefer many small files over few large ones
- Use `index.ts` barrel files for clean re-exports from directories
- No unused imports or variables - the linter will catch these
- Use default imports for Node.js built-in modules: `import PATH from 'node:path'`, `import FS from 'node:fs'` — not named imports like `import { resolve } from 'node:path'` (enforced by `unicorn/import-style`)
- String quotes: single quotes for code, backticks for interpolation
- Trailing commas: always (ES5+)
- Semicolons: never (rely on ASI)
- Indent with 2 spaces
