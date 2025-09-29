import chalk from 'chalk'

import { runSteps } from '../lib/index.ts'

export interface RelintParams {
  cache?: boolean
  fix?: boolean
  incremental?: boolean
  pkg?: string
  verbose?: boolean
}

export interface RelintPackageParams {
  pkg: string
  verbose?: boolean
}

export const relintPackage = ({
  pkg, fix, verbose,
}: RelintParams & Required<Pick<RelintParams, 'pkg'>>) => {
  console.log(chalk.gray(`${fix ? 'Fix' : 'Lint'} [${pkg}]`))
  const start = Date.now()

  const result = runSteps(`${fix ? 'Fix' : 'Lint'}  [${pkg}]`, [
    ['yarn', ['workspace',
      pkg,
      'run',
      fix ? 'package-fix' : verbose ? 'package-lint-verbose' : 'package-lint',
    ]],
  ])
  console.log(chalk.gray(`${fix ? 'Fixed in' : 'Linted in'} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`))
  return result
}

export const relint = ({
  pkg, verbose, incremental, fix,
}: RelintParams = {}) => {
  return pkg === undefined
    ? relintAllPackages({
        verbose, incremental, fix,
      })
    : relintPackage({
        pkg, fix, verbose,
      })
}

export const relintAllPackages = ({ fix = false }: RelintParams = {}) => {
  console.log(chalk.gray(`${fix ? 'Fix' : 'Lint'} [All-Packages]`))
  const start = Date.now()
  // const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  // const incrementalOptions = incremental ? ['--since', '-Ap'] : ['--parallel', '-Ap']
  const fixOptions = fix ? ['--fix'] : []

  const result = runSteps(`${fix ? 'Fix' : 'Lint'}  [All-Packages]`, [
    ['yarn', ['eslint', ...fixOptions]],
  ])
  console.log(chalk.gray(`${fix ? 'Fixed in' : 'Linted in'} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`))
  return result
}
