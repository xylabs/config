import chalk from 'chalk'

export const checkResult = (name: string, result: number, level: 'error' | 'warn' = 'error', exitOnFail = false) => {
  if (result) {
    const exiting = exitOnFail ? '[Exiting Process]' : '[Continuing]'
    const chalkFunc = level === 'error' ? chalk.red : chalk.yellow
    console[level](chalkFunc(`${name} had ${result} failures ${exiting}`))
    if (exitOnFail) {
      process.exit(result)
    }
  }
}
