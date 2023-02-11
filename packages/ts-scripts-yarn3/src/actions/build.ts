import chalk from 'chalk'

import { runSteps } from '../lib'

export interface BuildParams {
  jobs?: number
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const build = ({ jobs, target, verbose }: BuildParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }
  const result = runSteps('Build', [
    ['yarn', ['xy', 'compile', ...targetOptions, ...verboseOptions, ...jobsOptions]],
    ['yarn', ['xy', 'lint', ...verboseOptions]],
    ['yarn', ['xy', 'deps', ...verboseOptions, ...jobsOptions]],
  ])
  console.log(`${chalk.gray('Built in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
