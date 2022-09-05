/** Catch child process a crash and returns the code */

import { processEx } from './processEx'

const safeExit = (func: () => number | undefined) => {
  try {
    const result = func()
    if (result) {
      process.exit(result)
    }
    return result
  } catch (ex) {
    processEx(ex)
  }
}

export { safeExit }
