import chalk from 'chalk'

import { runSteps } from '../lib/index.ts'

export interface LintParams {
  fix?: boolean
  incremental?: boolean
  pkg?: string
  verbose?: boolean
}

export interface LintPackageParams {
  pkg: string
  verbose?: boolean
}

export const lintPackage = ({
  pkg, fix, verbose,
}: LintParams & Required<Pick<LintParams, 'pkg'>>) => {
  console.log(chalk.gray(`${fix ? 'Fix' : 'Lint'} [All-Packages]`))
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']

  const result = runSteps(`${fix ? 'Fix' : 'Lint'}  [All-Packages]`, [
    ['yarn', ['workspace',
      pkg,
      ...verboseOptions,
      'run',
      fix ? 'package-fix' : 'package-lint',
    ]],
  ])
  console.log(chalk.gray(`${fix ? 'Fixed in' : 'Linted in'} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`))
  return result
}

export const lint = ({
  pkg, verbose, incremental, fix,
}: LintParams = {}) => {
  return pkg
    ? lintPackage({ pkg, fix })
    : lintAllPackages({
        verbose, incremental, fix,
      })
}

export const lintAllPackages = ({
  fix, verbose = true, incremental,
}: LintParams = {}) => {
  console.log(chalk.gray(`${fix ? 'Fix' : 'Lint'} [All-Packages]`))
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  const incrementalOptions = incremental ? ['--since', '-Ap'] : ['--parallel', '-Ap']

  const result = runSteps(`${fix ? 'Fix' : 'Lint'}  [All-Packages]`, [
    ['yarn', ['workspaces',
      'foreach',
      ...verboseOptions,
      ...incrementalOptions,
      'run',
      fix ? 'package-fix' : 'package-lint',
    ]],
  ])
  console.log(chalk.gray(`${fix ? 'Fixed in' : 'Linted in'} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`))
  return result
}
