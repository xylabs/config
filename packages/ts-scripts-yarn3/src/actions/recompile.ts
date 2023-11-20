import chalk from 'chalk'

import { runStepsAsync } from '../lib'

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
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []

  return runStepsAsync(`Recompile [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-recompile', ...verboseOptions, ...targetOptions]]])
}

export const recompileAll = async ({ jobs, verbose, target, incremental }: RecompileParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []
  const incrementalOptions = incremental ? ['--since', '-Apt', '--topological-dev'] : ['--parallel', '-Apt', '--topological-dev']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = await runStepsAsync(`Recompile${incremental ? '-Incremental' : ''} [All]`, [
    ['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-recompile', ...verboseOptions, ...targetOptions]],
  ])
  console.log(`${chalk.gray('Recompiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
