import chalk from 'chalk'
import { ESLint } from 'eslint'

import { runSteps, yarnWorkspaces } from '../lib/index.ts'

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

export const lintPackage = async ({ pkg, fix }: LintParams) => {
  const workspace = yarnWorkspaces().find(workspace => workspace.name === pkg)
  if (!workspace) {
    console.error(chalk.red(`Unable to locate package [${chalk.magenta(pkg)}]`))
    process.exit(1)
  }

  const engine = new ESLint({ cache: true, fix })

  const lintResults = await engine.lintFiles(workspace.location)

  dumpMessages(lintResults)

  return lintResults.reduce((prev, lintResult) => prev + lintResult.errorCount, 0)
}

export const lintAll = async ({ fix }: LintParams) => {
  const workspace = yarnWorkspaces()
  for (const ws of workspace) {
    await lintPackage({ pkg: ws.name, fix })
  }
}

export const lint = async ({
  pkg, verbose, incremental, fix,
}: LintParams = {}) => {
  return pkg
    ? await lintPackage({ pkg, fix })
    : lintAllPackages({
        verbose, incremental, fix,
      })
}

export const lintAllPackages = ({
  fix, verbose = true, incremental,
}: LintParams = {}) => {
  console.log(chalk.gray('Linting [All-Packages]'))
  const start = Date.now()
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  const fixOptions = fix ? ['--fix'] : ['']
  const incrementalOptions = incremental ? ['--since', '-Apt'] : ['--parallel', '-Apt']

  const result = runSteps('Lint [All-Packages]', [
    ['yarn', ['workspaces',
      'foreach',
      ...verboseOptions,
      ...incrementalOptions,
      'run',
      'package-lint',
      ...fixOptions,
    ]],
  ])
  console.log(`${chalk.gray('Linted in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
