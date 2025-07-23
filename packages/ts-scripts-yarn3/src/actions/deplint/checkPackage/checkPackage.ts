import type { Workspace } from '../../../lib/index.ts'
import { findFiles } from '../findFiles.ts'
import { getDependenciesFromPackageJson } from '../getDependenciesFromPackageJson.ts'
import { getExternalImportsFromFiles } from '../getExternalImportsFromFiles.ts'
import { getUnlistedDependencies } from './getUnlistedDependencies.ts'
import { getUnlistedDevDependencies } from './getUnlistedDevDependencies.ts'
import { getUnusedDependencies } from './getUnusedDependencies.ts'
import { getUnusedPeerDependencies } from './getUnusedPeerDependencies.ts'

export interface CheckPackageOptions {
  deps?: boolean
  devDeps?: boolean
  peerDeps?: boolean
  verbose?: boolean
}

export function checkPackage({
  name, location, deps = false, devDeps = false, peerDeps = false, verbose = false,
}: CheckPackageOptions & Workspace) {
  const { srcFiles, distFiles } = findFiles(location)
  if (verbose) {
    console.info(`Checking package: ${name} at ${location}`)
    console.info(`Source files: ${srcFiles.length}, Distribution files: ${distFiles.length}`)
    for (const file of srcFiles) {
      console.info(`Source file: ${file}`)
    }
    for (const file of distFiles) {
      console.info(`Distribution file: ${file}`)
    }
  }
  const checkDeps = deps || !(deps || devDeps || peerDeps)
  const checkDevDeps = devDeps || !(deps || devDeps || peerDeps)
  const checkPeerDeps = peerDeps // || !(deps || devDeps || peerDeps)
  const sourceParams = getExternalImportsFromFiles({ srcFiles, distFiles })

  const packageParams = getDependenciesFromPackageJson(`${location}/package.json`)

  const unlistedDependencies = checkDeps ? getUnlistedDependencies({ name, location }, packageParams, sourceParams) : 0
  const unusedDependencies = checkDeps ? getUnusedDependencies({ name, location }, packageParams, sourceParams) : 0
  const unlistedDevDependencies = checkDevDeps ? getUnlistedDevDependencies({ name, location }, packageParams, sourceParams) : 0
  const unusedPeerDependencies = checkPeerDeps ? getUnusedPeerDependencies({ name, location }, packageParams, sourceParams) : 0

  const totalErrors = unlistedDependencies + unlistedDevDependencies + unusedDependencies + unusedPeerDependencies
  return totalErrors
}
