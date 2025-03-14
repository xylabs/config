import chalk from 'chalk'

import { runSteps } from '../lib/index.ts'

export interface RelintParams {
  incremental?: boolean
  pkg?: string
  verbose?: boolean
}

export interface RelintPackageParams {
  pkg: string
  verbose?: boolean
}

export const relintPackage = ({ pkg }: RelintParams & Required<Pick<RelintParams, 'pkg'>>) => {
  console.log(chalk.gray(`${'Relint'} [All-Packages]`))
  const start = Date.now()

  const result = runSteps('Relint [All-Packages]', [
    ['yarn', ['workspace',
      pkg,
      'run',
      'package-relint',
    ]],
  ])
  console.log(chalk.gray(`${'Relinted in'} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`))
  return result
}

export const relint = ({
  pkg, verbose, incremental,
}: RelintParams = {}) => {
  return pkg
    ? relintPackage({ pkg })
    : relintAllPackages({ verbose, incremental })
}

export const relintAllPackages = ({ verbose = true, incremental }: RelintParams = {}) => {
  console.log(chalk.gray(`${'Relint'} [All-Packages]`))
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  const incrementalOptions = incremental ? ['--since', '-Ap'] : ['--parallel', '-Ap']

  const result = runSteps(`${'Relint'}  [All-Packages]`, [
    ['yarn', ['workspaces',
      'foreach',
      ...verboseOptions,
      ...incrementalOptions,
      'run',
      'package-relint',
    ]],
  ])
  console.log(chalk.gray(`Relinted in [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`))
  return result
}
