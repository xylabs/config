/** Catch child process a crash and returns the code */

import { processEx } from './processEx'

const safeExit = (func: () => number | null | undefined | void) => {
  try {
    return func()
  } catch (ex) {
    processEx(ex)
  }
}

export { safeExit }
