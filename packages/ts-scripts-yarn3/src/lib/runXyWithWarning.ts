import chalk from 'chalk'

export const runXyWithWarning = (command: string) => {
  console.warn(chalk.yellow(`WARNING: [${chalk.white(`yarn ${command}`)}] is deprecated for XY Labs Scripts.`))
  console.warn(chalk.gray(`Did you mean [${chalk.magenta(`yarn xy ${command}`)}]?`))
  return 1
}
