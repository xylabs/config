import { withError } from './withError'

export const withErrnoException = <T extends NodeJS.ErrnoException = NodeJS.ErrnoException>(ex: any, closure: (error: T) => number) => {
  return withError<T>(ex, closure, (ex: any) => ex.errno !== undefined)
}
