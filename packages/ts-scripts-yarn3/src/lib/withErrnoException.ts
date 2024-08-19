import { withError } from './withError.ts'

export const withErrnoException = <T extends NodeJS.ErrnoException = NodeJS.ErrnoException>(
  ex: unknown, closure: (error: T) => number,
) => {
  return withError<T>(ex, closure, (ex: unknown) => (ex as NodeJS.ErrnoException).errno !== undefined)
}
