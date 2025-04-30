import type { Workspace } from '../../../lib/index.ts'
import { findFiles } from '../findFiles.ts'
import { getDependenciesFromPackageJson } from '../getDependenciesFromPackageJson.ts'
import { getExternalImportsFromFiles } from '../getExternalImportsFromFiles.ts'
import { getTypesInDependencies } from './getTypesInDependencies.ts'
import { getUnlistedDependencies } from './getUnlistedDependencies.ts'
import { getUnlistedDevDependencies } from './getUnlistedDevDependencies.ts'
import { getUnusedDependencies } from './getUnusedDependencies.ts'
import { getUnusedPeerDependencies } from './getUnusedPeerDependencies.ts'

export interface CheckPackageOptions extends Workspace {
  deps?: boolean
  devDeps?: boolean
  peerDeps?: boolean
}

export function checkPackage({
  name, location, deps = true, devDeps = false, peerDeps = false,
}: CheckPackageOptions) {
  const { prodSourceFiles, devSourceFiles } = findFiles(location)
  const sourceParams = getExternalImportsFromFiles({ prodSourceFiles, devSourceFiles })

  const packageParams = getDependenciesFromPackageJson(`${location}/package.json`)

  const unlistedDependencies = deps ? getUnlistedDependencies({ name, location }, packageParams, sourceParams) : 0
  const unlistedDevDependencies = devDeps ? getUnlistedDevDependencies({ name, location }, packageParams, sourceParams) : 0
  const unusedDependencies = deps ? getUnusedDependencies({ name, location }, packageParams, sourceParams) : 0
  const typesInDependencies = deps ? getTypesInDependencies({ name, location }, packageParams, sourceParams) : 0
  const unusedPeerDependencies = peerDeps ? getUnusedPeerDependencies({ name, location }, packageParams, sourceParams) : 0

  const totalErrors = unlistedDependencies + unlistedDevDependencies + unusedDependencies + typesInDependencies + unusedPeerDependencies

  return totalErrors
}
