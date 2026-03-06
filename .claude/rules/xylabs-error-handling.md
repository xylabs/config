# XY Labs - Error Handling

> Auto-managed by `yarn xy claude-rules`. Do not edit manually.

- Use typed errors extending a base error class
- Never swallow errors silently - at minimum log them
- Use `try/catch` at service boundaries, not around every call
