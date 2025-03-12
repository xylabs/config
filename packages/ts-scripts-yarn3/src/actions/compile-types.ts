import chalk from 'chalk'

import { runSteps } from '../lib/index.ts'

export interface CompileTypesParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  verbose?: boolean
}

interface CompileTypesPackageParams {
  pkg: string
  publint?: boolean
  verbose?: boolean
}

export const compileTypes = ({
  verbose, pkg, incremental, jobs,
}: CompileTypesParams) => {
  if (verbose) {
    console.log(chalk.gray('Compiling Types'))
  }
  return pkg
    ? compileTypesPackage({ pkg, verbose })
    : compileTypesAll({
        incremental, verbose, jobs,
      })
}

export const compileTypesPackage = ({ verbose, pkg }: CompileTypesPackageParams) => {
  if (verbose) {
    console.log(chalk.gray('Compiling Types [Package]'))
  }
  return runSteps(
    `Compile [${pkg}]`,
    [['yarn', ['workspace', pkg, 'run', 'package-compile-types']]],
  )
}

export const compileTypesAll = ({
  jobs, verbose, incremental,
}: CompileTypesParams) => {
  if (verbose) {
    console.log(chalk.gray('Compiling Types [All]'))
  }
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  const incrementalOptions = incremental ? ['--since', '-Apt'] : ['--parallel', '-Apt']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }

  const result = runSteps(`Compile Types ${incremental ? '[Incremental]' : ''} [All]`, [
    ['yarn', ['workspaces',
      'foreach',
      ...incrementalOptions,
      ...jobsOptions,
      ...verboseOptions,
      'run',
      'package-compile-types',
    ]],
  ])
  console.log(`${chalk.gray('Types Compiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
