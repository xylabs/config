/** Catch child process a crash and returns the code */

import { processEx } from './processEx'

const safeExit = (func: () => number | null | undefined | void) => {
  try {
    process.exit(func() ?? 0)
  } catch (ex) {
    processEx(ex)
  }
}

export { safeExit }
