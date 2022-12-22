import chalk from 'chalk'

import { runXy } from './runXy'

export const runXyWithWarning = (command: string) => {
  console.warn(chalk.yellow(`WARNING: [${chalk.white(`yarn ${command}`)}] is being deprecated.`))
  console.warn(chalk.gray(`use [${chalk.green(`yarn xy ${command}`)}] instead.`))
  return runXy(command)
}
