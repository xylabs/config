import { builtinModules } from 'node:module'

import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnlistedDependencies(
  { name, location }: Workspace,
  { dependencies, peerDependencies }: CheckPackageParams,
  {
    externalDistImports, externalDistTypeImports, distImportPaths,
  }: CheckSourceParams,
) {
  let unlistedDependencies = 0

  for (const imp of externalDistImports) {
    if (!dependencies.includes(imp)
      && !dependencies.includes(`@types/${imp}`)
      && !peerDependencies.includes(imp)
      && !peerDependencies.includes(`@types/${imp}`)
      && !builtinModules.includes(imp)
      && !builtinModules.includes(`@types/${imp}`)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${distImportPaths[imp].join('\n ')}`)
    }
  }

  for (const imp of externalDistTypeImports) {
    if (!dependencies.includes(imp)
      && dependencies.includes(`@types/${imp}`)
      && !peerDependencies.includes(imp)
      && peerDependencies.includes(`@types/${imp}`)
      && !builtinModules.includes(imp)
      && builtinModules.includes(`@types/${imp}`)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${distImportPaths[imp].join('\n ')}`)
    }
  }

  if (unlistedDependencies > 0) {
    const packageLocation = `${location}/package.json`
    console.log(`  ${chalk.yellow(packageLocation)}\n`)
  }
  return unlistedDependencies
}
