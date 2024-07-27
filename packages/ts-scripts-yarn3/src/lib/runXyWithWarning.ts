import chalk from 'chalk'

export const runXyWithWarning = (command: string) => {
  const commandString = `yarn ${command}`
  const commandXyString = `yarn xy ${command}`
  console.warn(chalk.yellow(`WARNING: [${chalk.white(commandString)}] is deprecated for XY Labs Scripts.`))
  console.warn(chalk.gray(`Did you mean [${chalk.magenta(commandXyString)}]?`))
  return 1
}
