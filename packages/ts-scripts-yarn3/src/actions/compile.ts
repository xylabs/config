import chalk from 'chalk'

import { runStepsAsync } from '../lib'

export interface CompileParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export interface CompilePackageParams {
  pkg: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const compile = async ({ verbose, target, pkg, incremental }: CompileParams) => {
  return pkg ? await compilePackage({ pkg, target, verbose }) : await compileAll({ incremental, target, verbose })
}

export const compilePackage = ({ verbose, target, pkg }: CompilePackageParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []

  return runStepsAsync(`Compile [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-compile', ...verboseOptions, ...targetOptions]]])
}

export const compileAll = async ({ jobs, verbose, target, incremental }: CompileParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []
  const incrementalOptions = incremental ? ['--since', '-ptA'] : ['-ptA']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = await runStepsAsync(`Compile${incremental ? '-Incremental' : ''} [All]`, [
    ['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-compile', ...verboseOptions, ...targetOptions]],
  ])
  console.log(`${chalk.gray('Compiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
