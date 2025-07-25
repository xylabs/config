import { builtinModules } from 'node:module'

import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnlistedDevDependencies(
  { name, location }: Workspace,
  {
    devDependencies, dependencies, peerDependencies,
  }: CheckPackageParams,
  {
    srcImportPaths, externalSrcImports, distImports,
  }: CheckSourceParams,
) {
  let unlistedDevDependencies = 0
  for (const imp of externalSrcImports) {
    if (!distImports.includes(imp)
      && imp !== name
      && !dependencies.includes(imp)
      && !dependencies.includes(`@types/${imp}`)
      && !peerDependencies.includes(imp)
      && !peerDependencies.includes(`@types/${imp}`)
      && !devDependencies.includes(imp)
      && !devDependencies.includes(`@types/${imp}`)
      && !builtinModules.includes(imp)
    ) {
      unlistedDevDependencies++
      console.log(`[${chalk.blue(name)}] Missing devDependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${srcImportPaths[imp].join('\n ')}`)
    }
  }
  if (unlistedDevDependencies > 0) {
    const packageLocation = `${location}/package.json`
    console.log(`  ${chalk.yellow(packageLocation)}\n`)
  }
  return unlistedDevDependencies
}
