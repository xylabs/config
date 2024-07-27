import { withErrnoException } from './withErrnoException'
import { withError } from './withError'

export const processEx = (ex: unknown) => {
  const error = typeof ex === 'string' ? new Error(ex) : ex
  const exitCode =
    withErrnoException(error, (error) => {
      if (error.code === 'ENOENT') {
        console.error(`'${error.path}' not found.`)
      } else {
        console.error(`Errno: ${error.code}`)
      }
      return error.errno ?? -1
    }) ??
    withError(error, (error) => {
      console.error(`${error.name}: ${error.message}`)
      return -1
    }) ??
    (() => {
      console.error(`Unexpected Error: ${JSON.stringify(ex, null, 2)}`)
      return -1
    })()
  //This allows us to use a previously set exit code
  process.exit(process.exitCode ?? exitCode)
}
