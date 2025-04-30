import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnusedPeerDependencies({ name, location }: Workspace, { peerDependencies }: CheckPackageParams, { externalProdImports }: CheckSourceParams) {
  let unusedDependencies = 0
  for (const dep of peerDependencies) {
    if (!externalProdImports.includes(dep)) {
      unusedDependencies++
      console.log(`[${chalk.blue(name)}] Unused peerDependency in package.json: ${chalk.red(dep)}`)
      console.log(`  ${location}/package.json\n`)
      console.log('')
    }
  }
  return unusedDependencies
}
