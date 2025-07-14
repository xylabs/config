import chalk from 'chalk'
import { glob } from 'glob'

export const getAllInputs = (srcDir: string, verbose = false) => {
  /* tsup wants posix paths */
  return [...glob.sync(`${srcDir}/**/*.ts`, { posix: true }).map((file) => {
    const result = file.slice(Math.max(0, srcDir.length + 1)) // Remove the folder prefix
    if (verbose) {
      console.log(chalk.gray(`getAllInputs: ${JSON.stringify(result, null, 2)}`))
    }
    return result
  }), ...glob.sync(`${srcDir}/**/*.tsx`, { posix: true }).map((file) => {
    const result = file.slice(Math.max(0, srcDir.length + 1)) // Remove the folder prefix
    if (verbose) {
      console.log(chalk.gray(`getAllInputs: ${JSON.stringify(result, null, 2)}`))
    }
    return result
  })]
}
