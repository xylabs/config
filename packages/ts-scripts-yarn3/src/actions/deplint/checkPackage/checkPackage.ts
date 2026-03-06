import type { Workspace } from '../../../lib/index.ts'
import { findFiles } from '../findFiles.ts'
import { getDependenciesFromPackageJson } from '../getDependenciesFromPackageJson.ts'
import { getExtendsFromTsconfigs } from '../getExtendsFromTsconfigs.ts'
import { getExternalImportsFromFiles } from '../getExternalImportsFromFiles.ts'
import { getUnlistedDependencies } from './getUnlistedDependencies.ts'
import { getUnlistedDevDependencies } from './getUnlistedDevDependencies.ts'
import { getUnusedDependencies } from './getUnusedDependencies.ts'
import { getUnusedDevDependencies } from './getUnusedDevDependencies.ts'
import { getUnusedPeerDependencies } from './getUnusedPeerDependencies.ts'

export interface CheckPackageOptions {
  deps?: boolean
  devDeps?: boolean
  peerDeps?: boolean
  verbose?: boolean
}

function logVerbose(
  name: string,
  location: string,
  allFiles: string[],
  distFiles: string[],
  tsconfigExtends: string[],
) {
  console.info(`Checking package: ${name} at ${location}`)
  console.info(`All files: ${allFiles.length}, Distribution files: ${distFiles.length}`)
  for (const file of allFiles) {
    console.info(`File: ${file}`)
  }
  for (const file of distFiles) {
    console.info(`Distribution file: ${file}`)
  }
  for (const ext of tsconfigExtends) {
    console.info(`Tsconfig extends: ${ext}`)
  }
}

export function checkPackage({
  name, location, deps = false, devDeps = false, peerDeps = false, verbose = false,
}: CheckPackageOptions & Workspace) {
  const { allFiles, distFiles } = findFiles(location)
  const tsconfigExtends = getExtendsFromTsconfigs(location)
  if (verbose) {
    logVerbose(name, location, allFiles, distFiles, tsconfigExtends)
  }
  const checkDeps = deps || !(deps || devDeps || peerDeps)
  const checkDevDeps = devDeps || !(deps || devDeps || peerDeps)
  const checkPeerDeps = peerDeps // || !(deps || devDeps || peerDeps)
  const sourceParams = getExternalImportsFromFiles({
    allFiles, distFiles, tsconfigExtends,
  })

  const packageParams = getDependenciesFromPackageJson(`${location}/package.json`)

  const unlistedDependencies = checkDeps ? getUnlistedDependencies({ name, location }, packageParams, sourceParams) : 0
  const unusedDependencies = checkDeps ? getUnusedDependencies({ name, location }, packageParams, sourceParams) : 0
  const unlistedDevDependencies = checkDevDeps ? getUnlistedDevDependencies({ name, location }, packageParams, sourceParams) : 0
  const fileContext = { allFiles, distFiles }
  const unusedDevDependencies = checkDevDeps
    ? getUnusedDevDependencies({ name, location }, packageParams, sourceParams, fileContext)
    : 0
  const unusedPeerDependencies = checkPeerDeps ? getUnusedPeerDependencies({ name, location }, packageParams, sourceParams) : 0

  const totalErrors = unlistedDependencies + unlistedDevDependencies + unusedDependencies + unusedDevDependencies + unusedPeerDependencies
  return totalErrors
}
