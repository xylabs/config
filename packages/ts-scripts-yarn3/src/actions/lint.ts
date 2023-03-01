import chalk from 'chalk'

import { runSteps, yarnWorkspaces } from '../lib'

export interface LintParams {
  pkg?: string
  verbose?: boolean
}

export interface LintPackageParams {
  pkg: string
  verbose?: boolean
}

export const lintPackage = ({ pkg }: LintParams) => {
  const workspace = yarnWorkspaces().find((workspace) => workspace.name === pkg)
  if (!workspace) {
    console.error(chalk.red(`Unable to locate package [${chalk.magenta(pkg)}]`))
    process.exit(1)
  }
  return runSteps(`Lint-Caching [${pkg}]`, [['yarn', ['eslint', workspace.location, '--cache']]])
}

export const lint = ({ pkg }: LintParams) => {
  return pkg ? lintPackage({ pkg }) : runSteps('Lint-Caching [All]', [['yarn', ['eslint', '.', '--cache']]])
}
