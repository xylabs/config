import chalk from 'chalk'

import { runSteps, ScriptStep } from '../lib'

export interface DepsParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  verbose?: boolean
}

export interface DepsPackageParams {
  pkg: string
}

export const deps = ({ pkg, incremental }: DepsParams) => {
  pkg ? depsPackage({ pkg }) : depsAll({ incremental })
  //returning 0 here since we never wants deps to be fatal
  return 0
}

export const depsPackage = ({ pkg }: DepsPackageParams) => {
  const steps: ScriptStep[] = [['yarn', ['workspace', pkg, 'run', 'package-deps']]]

  return runSteps(`Deps [${pkg}]`, [...steps])
}

export const depsAll = ({ incremental, jobs, verbose }: DepsParams) => {
  const start = Date.now()
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }
  const incrementalOptions = incremental ? ['--since', '-pA'] : ['-pA']
  const steps: ScriptStep[] = [['yarn', ['workspaces', 'foreach', ...jobsOptions, ...incrementalOptions, ...verboseOptions, 'run', 'package-deps']]]

  const result = runSteps(`Deps${incremental ? '-Incremental' : ''} [All]`, [...steps])
  console.log(`${chalk.gray('Dep checked in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
