import chalk from 'chalk'
import { ESLint } from 'eslint'

import { runSteps, yarnWorkspaces } from '../lib'

export interface LintParams {
  pkg?: string
  verbose?: boolean
}

export interface LintPackageParams {
  pkg: string
  verbose?: boolean
}

export const lintPackage = async ({ pkg }: LintParams) => {
  const workspace = yarnWorkspaces().find((workspace) => workspace.name === pkg)
  if (!workspace) {
    console.error(chalk.red(`Unable to locate package [${chalk.magenta(pkg)}]`))
    process.exit(1)
  }

  const engine = new ESLint({ cache: true })

  const lintResults = await engine.lintFiles(workspace.location)

  console.log(lintResults)

  const errorCount = lintResults.reduce((prev, lintResult) => prev + lintResult.errorCount, 0)

  return errorCount
}

export const lintAll = async () => {
  const engine = new ESLint({ cache: true })

  const lintResults = await engine.lintFiles('./**/*.*')

  console.log(lintResults)

  const errorCount = lintResults.reduce((prev, lintResult) => prev + lintResult.errorCount, 0)

  return errorCount
}

export const lint = async ({ pkg }: LintParams = {}) => {
  return pkg ? await lintPackage({ pkg }) : runSteps('Lint-Caching [All]', [['yarn', ['eslint', '.', '--cache']]])
}
