import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnlistedDependencies({ name }: Workspace, {
  dependencies, devDependencies, peerDependencies,
}: CheckPackageParams, {
  externalProdTypeImports, prodTypeImportPaths, externalProdImports, prodImportPaths,
}: CheckSourceParams) {
  let unlistedDependencies = 0

  // check production type imports
  for (const imp of externalProdTypeImports) {
    if (!dependencies.includes(imp) && !peerDependencies.includes(imp) && !dependencies.includes(`@types/${imp}`)
      && !peerDependencies.includes(`@types/${imp}`)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${prodTypeImportPaths[imp].join('\n')}`)
      console.log('')
    }
  }

  // check production imports
  for (const imp of externalProdImports) {
    if (!dependencies.includes(imp) && !peerDependencies.includes(imp)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${prodImportPaths[imp].join('\n')}`)
      console.log('')
    }
  }
  return unlistedDependencies
}
