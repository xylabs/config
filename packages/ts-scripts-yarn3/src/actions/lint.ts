import chalk from 'chalk'

import { runSteps } from '../lib/index.ts'

export interface LintParams {
  cache?: boolean
  fix?: boolean
  incremental?: boolean
  pkg?: string
  verbose?: boolean
}

export interface LintPackageParams {
  pkg: string
  verbose?: boolean
}

export const lintPackage = ({ pkg, fix }: LintParams & Required<Pick<LintParams, 'pkg'>>) => {
  console.log(chalk.gray(`${fix ? 'Fix' : 'Lint'} [${pkg}]`))
  const start = Date.now()

  const result = runSteps(`${fix ? 'Fix' : 'Lint'}  [${pkg}]`, [
    ['yarn', ['workspace',
      pkg,
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

export const lintAllPackages = ({ fix = false }: LintParams = {}) => {
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
