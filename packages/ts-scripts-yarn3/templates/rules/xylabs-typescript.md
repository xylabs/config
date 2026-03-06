# XY Labs - TypeScript Specifics

> Auto-managed by `yarn xy claude-rules`. Do not edit manually.

- Enable `strict: true` in all tsconfig files
- Avoid `any` - use `unknown` when the type is truly unknown
- Avoid type assertions (`as`) - prefer type guards and narrowing
- Use `satisfies` for type checking without widening
- Prefer `Record<string, T>` over index signatures
- Use discriminated unions for state machines and variant types
- When a function uses `await`, its return type must be `Promise<T>` — never `Promise<Promisable<T>>`. If converting a `Promisable<T>` return type to async, replace it with `Promise<T>`, do not wrap it
