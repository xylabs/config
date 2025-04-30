import chalk from 'chalk'

import { yarnWorkspace, yarnWorkspaces } from '../../lib/index.ts'
import { checkPackage } from './checkPackage/index.ts'

export const deplint = ({
  pkg, deps, devDeps, peerDeps,
}: { deps: boolean; devDeps: boolean; peerDeps: boolean; pkg: string }) => {
  if (pkg) {
    const { location, name } = yarnWorkspace(pkg)

    console.log(`Running Deplint for ${name}`)
    checkPackage({
      name, location, devDeps, deps, peerDeps,
    })
  } else {
    const workspaces = yarnWorkspaces()

    console.log('Deplint Started...')

    let totalErrors = 0

    for (const workspace of workspaces) {
      totalErrors += checkPackage({
        ...workspace, deps, devDeps, peerDeps,
      })
    }

    if (totalErrors > 0) {
      console.log(`Deplint: Found ${chalk.red(totalErrors)} dependency problems. ${chalk.red('✖')}`)
    } else {
      console.log(`Deplint: Found no dependency problems. ${chalk.green('✔')}`)
    }
  }
  return 0
}
