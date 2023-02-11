import chalk from 'chalk'

import { runSteps } from '../lib'

export interface BuildParams {
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const build = ({ target, verbose }: BuildParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []
  const result = runSteps('Build', [
    ['yarn', ['xy', 'compile', ...targetOptions, ...verboseOptions]],
    ['yarn', ['xy', 'lint', ...verboseOptions]],
    ['yarn', ['xy', 'deps', ...verboseOptions]],
  ])
  console.log(`${chalk.gray('Built in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
