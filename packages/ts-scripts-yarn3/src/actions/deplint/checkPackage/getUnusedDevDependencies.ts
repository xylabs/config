import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { ImplicitDepContext } from '../implicitDevDependencies.ts'
import { getImplicitDevDependencies } from '../implicitDevDependencies.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

const allExternalImports = ({
  externalSrcImports,
  externalDistImports,
  externalDistTypeImports,
  externalConfigImports,
}: CheckSourceParams) => {
  const all = new Set<string>([
    ...externalSrcImports,
    ...externalDistImports,
    ...externalDistTypeImports,
    ...externalConfigImports,
  ])
  return all
}

function isDevDepUsed(dep: string, allImports: Set<string>, implicitDeps: Set<string>) {
  if (implicitDeps.has(dep)) return true

  if (dep.startsWith('@types/')) {
    const baseName = dep.replace(/^@types\//, '')
    return allImports.has(baseName) || allImports.has(dep) || implicitDeps.has(baseName)
  }

  return allImports.has(dep)
}

export function getUnusedDevDependencies(
  { name, location }: Workspace,
  {
    devDependencies, dependencies, peerDependencies,
  }: CheckPackageParams,
  sourceParams: CheckSourceParams,
  fileContext: ImplicitDepContext,
) {
  const allImports = allExternalImports(sourceParams)
  const implicitDeps = getImplicitDevDependencies(fileContext)
  let unusedDevDependencies = 0
  for (const dep of devDependencies) {
    // Skip devDeps that are also declared as dependencies or peerDependencies
    if (dependencies.includes(dep) || peerDependencies.includes(dep)) continue

    if (!isDevDepUsed(dep, allImports, implicitDeps)) {
      unusedDevDependencies++
      console.log(`[${chalk.blue(name)}] Unused devDependency in package.json: ${chalk.red(dep)}`)
    }
  }
  if (unusedDevDependencies > 0) {
    const packageLocation = `${location}/package.json`
    console.log(`  ${chalk.yellow(packageLocation)}\n`)
  }
  return unusedDevDependencies
}
