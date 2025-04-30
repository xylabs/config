import chalk from 'chalk'

import { yarnWorkspace, yarnWorkspaces } from '../../lib/index.ts'
import { checkPackage } from './checkPackage/index.ts'

export const deplint = ({ pkg }: { pkg: string }) => {
  if (pkg) {
    const { location, name } = yarnWorkspace(pkg)

    console.log(`Running Deplint for ${name}`)
    checkPackage({
      name, location, devDeps: true,
    })
  } else {
    const workspaces = yarnWorkspaces()

    console.log('Deplint Started...')

    let totalErrors = 0

    for (const workspace of workspaces) {
      totalErrors += checkPackage(workspace)
    }

    if (totalErrors > 0) {
      console.log(`Found ${chalk.red(totalErrors)} unlisted imports.`)
    } else {
      console.log(`No unlisted imports found. ${chalk.green('✔')}`)
    }
  }
  return 0
}
