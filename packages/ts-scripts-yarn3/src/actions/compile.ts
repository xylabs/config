import chalk from 'chalk'

import { runSteps } from '../lib/index.ts'

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

export const compile = ({
  verbose, target, pkg, incremental, publint, jobs,
}: CompileParams) => {
  return pkg
    ? compilePackage({
      pkg, publint, target, verbose,
    })
    : compileAll({
      incremental, publint, target, verbose, jobs,
    })
}

export const compilePackage = ({ target, pkg }: CompilePackageParams) => {
  const targetOptions = target ? ['-t', target] : []

  return runSteps(`Compile [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-compile', ...targetOptions]]])
}

export const compileAll = ({
  jobs, verbose, target, incremental,
}: CompileParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  const targetOptions = target ? ['-t', target] : []
  const incrementalOptions = incremental ? ['--since', '-Apt', '--topological-dev'] : ['--parallel', '-Apt', '--topological-dev']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = runSteps(`Compile${incremental ? '-Incremental' : ''} [All]`, [
    ['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, ...verboseOptions, 'run', 'package-compile', ...targetOptions]],
  ])
  console.log(`${chalk.gray('Compiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
