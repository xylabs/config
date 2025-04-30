/* eslint-disable complexity */
/* eslint-disable max-statements */

import chalk from 'chalk'

import type { Workspace } from '../../lib/index.ts'
import { findFiles } from './findFiles.ts'
import { getDependenciesFromPackageJson } from './getDependenciesFromPackageJson.ts'
import { getExternalImportsFromFiles } from './getExternalImportsFromFiles.ts'

export interface CheckPackageOptions extends Workspace {
  devDeps?: boolean
  peerDeps?: boolean
}

export function checkPackage({
  name, location, devDeps = false, peerDeps = false,
}: CheckPackageOptions) {
  const { prodSourceFiles, devSourceFiles } = findFiles(location)
  const {
    prodTypeImportPaths, prodImportPaths, externalProdTypeImports, devImportPaths, externalProdImports, externalDevImports,
  } = getExternalImportsFromFiles({ prodSourceFiles, devSourceFiles })

  const {
    dependencies, devDependencies, peerDependencies,
  } = getDependenciesFromPackageJson(`${location}/package.json`)

  let unlistedDependencies = 0
  let unlistedDevDependencies = 0
  let unusedDependencies = 0
  let typesInDependencies = 0

  for (const imp of externalProdTypeImports) {
    if (!dependencies.includes(imp) && !peerDependencies.includes(imp) && !devDependencies.includes(imp) && !devDependencies.includes(`@types/${imp}`)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${prodTypeImportPaths[imp].join('\n')}`)
      console.log('')
    }
  }

  for (const imp of externalProdImports) {
    if (!dependencies.includes(imp) && !peerDependencies.includes(imp)) {
      unlistedDependencies++
      console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
      console.log(`  ${prodImportPaths[imp].join('\n')}`)
      console.log('')
    }
  }

  for (const dep of dependencies) {
    if (dep.startsWith('@types/')) {
      typesInDependencies++
      console.log(`[${chalk.blue(name)}] @types in dependencies in package.json: ${chalk.red(dep)}`)
      console.log(`  ${location}/package.json\n`)
      console.log('')
    }
    if (!externalProdImports.includes(dep)) {
      unusedDependencies++
      console.log(`[${chalk.blue(name)}] Unused dependency in package.json: ${chalk.red(dep)}`)
      console.log(`  ${location}/package.json\n`)
      console.log('')
    }
  }

  if (peerDeps) {
    for (const dep of peerDependencies) {
      if (!externalProdImports.includes(dep)) {
        unusedDependencies++
        console.log(`[${chalk.blue(name)}] Unused peerDependency in package.json: ${chalk.red(dep)}`)
        console.log(`  ${location}/package.json\n`)
        console.log('')
      }
    }
  }

  if (devDeps) {
    for (const imp of externalDevImports) {
      if (!devDependencies.includes(imp)) {
        unlistedDevDependencies++
        console.log(`[${chalk.blue(name)}] Missing devDependency in package.json: ${chalk.red(imp)}`)
        console.log(`  Found in: ${devImportPaths[imp].join(', ')}`)
      }
    }
  }

  const totalErrors = unlistedDependencies + unlistedDevDependencies + unusedDependencies + typesInDependencies

  return totalErrors
}
