/** Catch child process a crash and returns the code */

import { processEx } from './processEx.ts'

const safeExit = (func: () => number, exitOnFail = true): number => {
  try {
    const result = func()
    if (result && exitOnFail) {
      process.exit(result)
    }
    return result
  } catch (ex) {
    return processEx(ex)
  }
}

const safeExitAsync = async (func: () => Promise<number>, exitOnFail = true): Promise<number> => {
  try {
    const result = await func()
    if (result && exitOnFail) {
      process.exit(result)
    }
    return result
  } catch (ex) {
    return processEx(ex)
  }
}

export { safeExit, safeExitAsync }
