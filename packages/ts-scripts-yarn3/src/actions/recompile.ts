import chalk from 'chalk'

import { runStepsAsync } from '../lib/index.ts'

export interface RecompileParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export interface RecompilePackageParams {
  pkg: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const recompile = async ({ verbose, target, pkg, incremental }: RecompileParams) => {
  return pkg ? await recompilePackage({ pkg, target, verbose }) : await recompileAll({ incremental, target, verbose })
}

export const recompilePackage = ({ verbose, target, pkg }: RecompilePackageParams) => {
  const targetOptions = target ? ['-t', target] : []
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']

  return runStepsAsync(
    `Recompile [${pkg}]`, [['yarn', ['workspace', pkg, ...verboseOptions, 'run', 'package-recompile', ...targetOptions]]])
}

export const recompileAll = async ({ jobs, verbose, target, incremental }: RecompileParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  const targetOptions = target ? ['-t', target] : []
  const incrementalOptions = incremental
    ? ['--since', '-Apt', '--topological-dev']
    : ['--parallel', '-Apt', '--topological-dev']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = await runStepsAsync(`Recompile${incremental ? '-Incremental' : ''} [All]`, [
    ['yarn',
      [
        'workspaces',
        'foreach',
        ...incrementalOptions,
        ...jobsOptions,
        ...verboseOptions,
        'run',
        'package-clean',
        ...targetOptions],
    ],
    ['yarn',
      [
        'workspaces',
        'foreach',
        ...incrementalOptions,
        ...jobsOptions,
        ...verboseOptions,
        'run',
        'package-compile',
        ...targetOptions]],
  ])
  console.log(
    `${chalk.gray('Recompiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
