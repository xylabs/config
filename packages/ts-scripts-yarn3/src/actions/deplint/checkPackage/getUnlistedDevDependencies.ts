import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnlistedDevDependencies(
  { name }: Workspace,
  {
    devDependencies, dependencies, peerDependencies,
  }: CheckPackageParams,
  { devImportPaths, externalDevImports }: CheckSourceParams,
) {
  let unlistedDevDependencies = 0
  for (const imp of externalDevImports) {
    if (!devDependencies.includes(imp) && !dependencies.includes(imp) && !peerDependencies.includes(imp)) {
      unlistedDevDependencies++
      console.log(`[${chalk.blue(name)}] Missing devDependency in package.json: ${chalk.red(imp)}`)
      console.log(`  Found in: ${devImportPaths[imp].join(', ')}`)
    }
  }
  return unlistedDevDependencies
}
