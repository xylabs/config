import chalk from 'chalk'

import { runSteps } from '../lib'

export interface CompileParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  publint?: boolean
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

interface CompilePackageParams {
  pkg: string
  publint?: boolean
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const compile = ({ verbose, target, pkg, incremental, publint }: CompileParams) => {
  return pkg ? compilePackage({ pkg, publint, target, verbose }) : compileAll({ incremental, publint, target, verbose })
}

export const compilePackage = ({ verbose, target, pkg, publint = true }: CompilePackageParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []

  return publint
    ? runSteps(`Compile [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-compile', ...verboseOptions, ...targetOptions]]])
    : runSteps(`Compile [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-compile', ...verboseOptions, ...targetOptions]]])
}

export const compileAll = ({ jobs, verbose, target, incremental }: CompileParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []
  const incrementalOptions = incremental ? ['--since', '--parallel', '--all'] : ['--parallel', '--all']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = runSteps(`Compile${incremental ? '-Incremental' : ''} [All]`, [
    ['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-compile', ...verboseOptions, ...targetOptions]],
  ])
  console.log(`${chalk.gray('Compiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
