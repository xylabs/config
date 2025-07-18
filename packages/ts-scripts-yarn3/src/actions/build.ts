import chalk from 'chalk'

import { runStepsAsync } from '../lib/index.ts'

export interface BuildParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const build = async ({
  incremental, jobs, target, verbose, pkg,
}: BuildParams) => {
  const start = Date.now()
  const pkgOptions = (pkg === undefined) ? [] : [pkg] // must go first
  const incrementalOptions = incremental ? ['-i'] : []
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = (target === undefined) ? [] : ['-t', target]
  const jobsOptions = (jobs === undefined) ? [] : ['-j', `${jobs}`]
  if (jobs !== undefined) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = await runStepsAsync(`Build${incremental ? '-Incremental' : ''} [${pkg ?? 'All'}]`, [
    ['yarn', ['xy', 'compile', ...pkgOptions, ...targetOptions, ...verboseOptions, ...jobsOptions, ...incrementalOptions, '--types', 'tsup']],
    ['yarn', ['xy', 'publint', ...pkgOptions, ...verboseOptions, ...jobsOptions, ...incrementalOptions]],
    ['yarn', ['xy', 'deplint', ...pkgOptions, ...verboseOptions, ...jobsOptions, ...incrementalOptions]],
    ['yarn', ['xy', 'lint', ...pkgOptions, ...verboseOptions, ...incrementalOptions]],
  ])
  console.log(`${chalk.gray('Built in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
