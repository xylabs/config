# XY Labs - Linting & ESLint Gotchas

> Auto-managed by `yarn xy claude-rules`. Do not edit manually.

## Post-change linting

After making significant code changes, run `yarn xy lint` to verify compliance
and fix any violations before considering the task complete.

## Non-obvious ESLint rules to follow

These are the rules most likely to be violated by generated code:

### Complexity limits
- **`max-statements: 32`** — functions must have 32 or fewer statements. Break large functions into smaller helpers.
- **`complexity: 18`** — max cyclomatic complexity of 18 per function
- **`max-lines: 512`** — files must not exceed 512 lines (blank lines excluded)
- **`max-depth: 6`** — max nesting depth of 6 levels

### Import style
- **`unicorn/import-style`** — use default imports for Node.js built-ins: `import PATH from 'node:path'`, not `import { resolve } from 'node:path'`
- **`no-restricted-imports`** — never import from barrel `index.ts` files (e.g. `'./index.ts'`, `'../index.ts'`). Import from the specific module file instead.

### Object formatting
- **`@stylistic/object-curly-newline`** — objects, imports, and destructuring with 3+ properties must use multi-line formatting:
  ```typescript
  // wrong
  const { created, templateNames, updated } = syncRuleFiles(rulesDir)

  // correct
  const {
    created, templateNames, updated,
  } = syncRuleFiles(rulesDir)
  ```
- **`@stylistic/object-curly-spacing`** — always use spaces inside braces: `{ foo }` not `{foo}`

### Expressions
- **`@typescript-eslint/no-unused-expressions`** — no standalone ternaries as statements. Use `if/else` instead of `condition ? a++ : b++`
- **`@typescript-eslint/no-unused-vars`** — prefix intentionally unused variables with `_` (e.g. `_unused`)

### Enums are disallowed
- **`no-restricted-syntax`** — do not use TypeScript `enum`. Use a union of string literals or a `const` object instead:
  ```typescript
  // wrong
  enum Status { Active, Inactive }

  // correct
  type Status = 'active' | 'inactive'
  ```

### Class member ordering
- **`@typescript-eslint/member-ordering`** — class members must be ordered: fields, constructor, accessors, methods. Within each group, order alphabetically.

### JSX
- **`@stylistic/jsx-curly-brace-presence`** — no unnecessary braces in JSX props: `prop="value"` not `prop={"value"}`
