import { builtinModules } from 'node:module'

import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

function isListedOrBuiltin(
  imp: string,
  name: string,
  dependencies: string[],
  peerDependencies: string[],
) {
  return dependencies.includes(imp)
    || imp === name
    || dependencies.includes(`@types/${imp}`)
    || peerDependencies.includes(imp)
    || peerDependencies.includes(`@types/${imp}`)
    || builtinModules.includes(imp)
    || builtinModules.includes(`@types/${imp}`)
}

function logMissing(name: string, imp: string, importPaths: Record<string, string[]>) {
  console.log(`[${chalk.blue(name)}] Missing dependency in package.json: ${chalk.red(imp)}`)
  if (importPaths[imp]) {
    console.log(`  ${importPaths[imp].join('\n ')}`)
  }
}

export function getUnlistedDependencies(
  { name, location }: Workspace,
  { dependencies, peerDependencies }: CheckPackageParams,
  {
    externalDistImports, externalDistTypeImports, distImportPaths,
  }: CheckSourceParams,
) {
  let unlistedDependencies = 0

  for (const imp of externalDistImports) {
    if (!isListedOrBuiltin(imp, name, dependencies, peerDependencies)) {
      unlistedDependencies++
      logMissing(name, imp, distImportPaths)
    }
  }

  for (const imp of externalDistTypeImports) {
    if (!isListedOrBuiltin(imp, name, dependencies, peerDependencies)) {
      unlistedDependencies++
      logMissing(name, imp, distImportPaths)
    }
  }

  if (unlistedDependencies > 0) {
    const packageLocation = `${location}/package.json`
    console.log(`  ${chalk.yellow(packageLocation)}\n`)
  }
  return unlistedDependencies
}
