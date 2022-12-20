import chalk from 'chalk'

import { runSteps } from '../lib'

export const lintFast = () => {
  console.log(chalk.magenta("Deprecated.  Use 'yarn lint' instead"))

  return runSteps('Lint [Caching]', [['yarn', ['eslint', '.', '--cache']]])
}
