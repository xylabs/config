import chalk from 'chalk'
import type { ESLint } from 'eslint'

import { runSteps, yarnWorkspaces } from '../lib/index.ts'

export interface RelintParams {
  incremental?: boolean
  pkg?: string
  verbose?: boolean
}

export interface RelintPackageParams {
  pkg: string
  verbose?: boolean
}

const dumpMessages = (lintResults: ESLint.LintResult[]) => {
  const colors: ('white' | 'red' | 'yellow')[] = ['white', 'yellow', 'red']
  const severity: string[] = ['none', 'warning', 'error']

  for (const lintResult of lintResults) {
    if (lintResult.messages.length > 0) {
      console.log(chalk.gray(`${lintResult.filePath}`))
      for (const message of lintResult.messages) {
        console.log(
          chalk.gray(`\t${message.line}:${message.column}`),
          chalk[colors[message.severity]](`\t${severity[message.severity]}`),
          chalk.white(`\t${message.message}`),
          chalk.gray(`\t${message.ruleId}`),
        )
      }
    }
  }
}

export const relintPackage = ({ pkg, verbose }: RelintParams & Required<Pick<RelintParams, 'pkg'>>) => {
  console.log(chalk.gray(`${'Relint'} [All-Packages]`))
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']

  const result = runSteps('Relint [All-Packages]', [
    ['yarn', ['workspace',
      pkg,
      ...verboseOptions,
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
