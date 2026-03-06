import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import { getRequiredPeerDependencies } from '../getRequiredPeerDependencies.ts'
import { getScriptReferencedPackages } from '../getScriptReferencedPackages.ts'
import type { FileContext } from '../implicitDevDependencies.ts'
import { getImplicitDevDependencies } from '../implicitDevDependencies.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

const allExternalImports = ({
  externalAllImports,
  externalDistImports,
  externalDistTypeImports,
}: CheckSourceParams) => {
  return new Set<string>([
    ...externalAllImports,
    ...externalDistImports,
    ...externalDistTypeImports,
  ])
}

function isDevDepUsed(
  dep: string,
  allImports: Set<string>,
  implicitDeps: Set<string>,
  requiredPeers: Set<string>,
  scriptRefs: Set<string>,
) {
  if (implicitDeps.has(dep)) return true
  if (requiredPeers.has(dep)) return true
  if (scriptRefs.has(dep)) return true

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
  fileContext: FileContext,
) {
  const allImports = allExternalImports(sourceParams)
  const allDeps = [...dependencies, ...devDependencies, ...peerDependencies]
  const implicitDeps = getImplicitDevDependencies({
    ...fileContext, allDependencies: allDeps, location,
  })
  const requiredPeers = getRequiredPeerDependencies(location, allDeps)
  const scriptRefs = getScriptReferencedPackages(location, allDeps)
  let unusedDevDependencies = 0
  for (const dep of devDependencies) {
    // Skip devDeps that are also declared as dependencies or peerDependencies
    if (dependencies.includes(dep) || peerDependencies.includes(dep)) continue

    if (!isDevDepUsed(dep, allImports, implicitDeps, requiredPeers, scriptRefs)) {
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
