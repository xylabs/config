import { withError } from './withError'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withErrnoException = <T extends NodeJS.ErrnoException = NodeJS.ErrnoException>(ex: any, closure: (error: T) => number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return withError<T>(ex, closure, (ex: any) => ex.errno !== undefined)
}
