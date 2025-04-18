import chalk from 'chalk'

import { runSteps } from '../lib/index.ts'

export interface CycleParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  verbose?: boolean
}

interface CyclePackageParams {
  pkg: string
  verbose?: boolean
}

export const cycle = ({
  verbose, pkg, incremental, jobs,
}: CycleParams = {}) => {
  return pkg
    ? cyclePackage({ pkg, verbose })
    : cycleAll({
        incremental, verbose, jobs,
      })
}

export const cyclePackage = ({ pkg, verbose }: CyclePackageParams) => {
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  return runSteps(
    `Cycle [${pkg}]`,
    [['yarn', ['workspace', pkg, 'run', 'package-cycle', ...verboseOptions]]],
  )
}

export const cycleAll = ({
  jobs, verbose, incremental,
}: CycleParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  const incrementalOptions = incremental ? ['--since', '-Ap', '--topological-dev'] : ['--parallel', '-Ap']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = runSteps(`Cycle${incremental ? '-Incremental' : ''} [All]`, [
    ['yarn', ['workspaces',
      'foreach',
      ...incrementalOptions,
      ...jobsOptions,
      ...verboseOptions,
      'run',
      'package-cycle',
      ...verboseOptions,
    ]],
  ])
  console.log(`${chalk.gray('Cycles Checked in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
