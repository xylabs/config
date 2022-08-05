/** Catch child process a crash and returns the code */

import { processEx } from './processEx'

const safeExit = (func: () => void) => {
  try {
    func()
  } catch (ex) {
    processEx(ex)
  }
}

export { safeExit }
