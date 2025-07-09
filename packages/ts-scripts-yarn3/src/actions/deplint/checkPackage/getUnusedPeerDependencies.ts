import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnusedPeerDependencies(
  { name, location }: Workspace,
  { peerDependencies, dependencies }: CheckPackageParams,
  { externalDistImports, externalDistTypeImports }: CheckSourceParams,
) {
  let unusedDependencies = 0
  for (const dep of peerDependencies) {
    if (!externalDistImports.includes(dep) && !externalDistImports.includes(dep.replace(/^@types\//, ''))
      && !externalDistTypeImports.includes(dep) && !externalDistTypeImports.includes(dep.replace(/^@types\//, ''))) {
      unusedDependencies++
      if (dependencies.includes(dep)) {
        console.log(`[${chalk.blue(name)}] Unused peerDependency [already a dependency] in package.json: ${chalk.red(dep)}`)
      } else {
        console.log(`[${chalk.blue(name)}] Unused peerDependency in package.json: ${chalk.red(dep)}`)
      }
    }
  }
  if (unusedDependencies > 0) {
    const packageLocation = `${location}/package.json`
    console.log(`  ${chalk.yellow(packageLocation)}\n`)
  }
  return unusedDependencies
}
