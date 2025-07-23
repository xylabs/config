import chalk from 'chalk'

import { yarnWorkspace, yarnWorkspaces } from '../../lib/index.ts'
import type { CheckPackageOptions } from './checkPackage/index.ts'
import { checkPackage } from './checkPackage/index.ts'

export interface DepLintOptions extends CheckPackageOptions {
  pkg?: string
}

export const deplint = ({
  pkg, deps, devDeps, peerDeps, verbose,
}: DepLintOptions) => {
  let totalErrors = 0

  if (pkg === undefined) {
    const workspaces = yarnWorkspaces()

    console.info('Deplint Started...')

    for (const workspace of workspaces) {
      totalErrors += checkPackage({
        ...workspace, deps, devDeps, peerDeps, verbose,
      })
    }
  } else {
    const { location, name } = yarnWorkspace(pkg)

    console.info(`Running Deplint for ${name}`)
    totalErrors += checkPackage({
      name, location, devDeps, deps, peerDeps, verbose,
    })
  }

  if (totalErrors > 0) {
    console.warn(`Deplint: Found ${chalk.red(totalErrors)} dependency problems. ${chalk.red('✖')}`)
  } else {
    console.info(`Deplint: Found no dependency problems. ${chalk.green('✔')}`)
  }
  return 0
}
