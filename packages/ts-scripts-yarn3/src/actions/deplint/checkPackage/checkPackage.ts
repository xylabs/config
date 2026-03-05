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
  srcFiles: string[],
  distFiles: string[],
  configFiles: string[],
  tsconfigExtends: string[],
) {
  console.info(`Checking package: ${name} at ${location}`)
  console.info(`Source files: ${srcFiles.length}, Distribution files: ${distFiles.length}, Config files: ${configFiles.length}`)
  for (const file of srcFiles) {
    console.info(`Source file: ${file}`)
  }
  for (const file of distFiles) {
    console.info(`Distribution file: ${file}`)
  }
  for (const file of configFiles) {
    console.info(`Config file: ${file}`)
  }
  for (const ext of tsconfigExtends) {
    console.info(`Tsconfig extends: ${ext}`)
  }
}

export function checkPackage({
  name, location, deps = false, devDeps = false, peerDeps = false, verbose = false,
}: CheckPackageOptions & Workspace) {
  const {
    srcFiles, distFiles, configFiles,
  } = findFiles(location)
  const tsconfigExtends = getExtendsFromTsconfigs(location)
  if (verbose) {
    logVerbose(name, location, srcFiles, distFiles, configFiles, tsconfigExtends)
  }
  const checkDeps = deps || !(deps || devDeps || peerDeps)
  const checkDevDeps = devDeps || !(deps || devDeps || peerDeps)
  const checkPeerDeps = peerDeps // || !(deps || devDeps || peerDeps)
  const sourceParams = getExternalImportsFromFiles({
    srcFiles, distFiles, configFiles, tsconfigExtends,
  })

  const packageParams = getDependenciesFromPackageJson(`${location}/package.json`)

  const unlistedDependencies = checkDeps ? getUnlistedDependencies({ name, location }, packageParams, sourceParams) : 0
  const unusedDependencies = checkDeps ? getUnusedDependencies({ name, location }, packageParams, sourceParams) : 0
  const unlistedDevDependencies = checkDevDeps ? getUnlistedDevDependencies({ name, location }, packageParams, sourceParams) : 0
  const fileContext = {
    configFiles, distFiles, srcFiles,
  }
  const unusedDevDependencies = checkDevDeps
    ? getUnusedDevDependencies({ name, location }, packageParams, sourceParams, fileContext)
    : 0
  const unusedPeerDependencies = checkPeerDeps ? getUnusedPeerDependencies({ name, location }, packageParams, sourceParams) : 0

  const totalErrors = unlistedDependencies + unlistedDevDependencies + unusedDependencies + unusedDevDependencies + unusedPeerDependencies
  return totalErrors
}
