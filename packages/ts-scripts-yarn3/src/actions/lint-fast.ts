import chalk from 'chalk'

import { runSteps } from '../lib'

export const lintFast = () => {
  console.log(chalk.magenta("Deprected.  Use 'yarn lint' instead"))

  runSteps('Lint [Caching]', [['node', ['./node_modules/eslint/bin/eslint.js', '.', '--cache']]])
}
