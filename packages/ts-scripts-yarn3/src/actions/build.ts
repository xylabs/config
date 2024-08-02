import chalk from 'chalk'

import { runStepsAsync } from '../lib/index.ts'

export interface BuildParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const build = async ({ incremental, jobs, target, verbose, pkg }: BuildParams) => {
  const start = Date.now()
  const pkgOptions = pkg ? [pkg] : [] // must go first
  const incrementalOptions = incremental ? ['-i'] : []
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = await runStepsAsync(`Build${incremental ? '-Incremental' : ''} [${pkg ?? 'All'}]`, [
    ['yarn', ['xy', 'compile', ...pkgOptions, ...targetOptions, ...verboseOptions, ...jobsOptions, ...incrementalOptions]],
    ['yarn', ['xy', 'lint', ...pkgOptions, ...verboseOptions, ...incrementalOptions]],
    ['yarn', ['xy', 'deps', ...pkgOptions, ...verboseOptions, ...jobsOptions, ...incrementalOptions]],
  ])
  console.log(`${chalk.gray('Built in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
