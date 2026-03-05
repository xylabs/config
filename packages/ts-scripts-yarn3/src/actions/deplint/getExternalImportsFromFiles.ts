import type { CheckSourceParams } from './checkPackage/index.ts'
import { getImportsFromFile } from './getImportsFromFile.ts'

const internalImportPrefixes = ['.', '#', 'node:']

const removeInternalImports = (imports: string[]) => {
  return imports.filter(imp => !internalImportPrefixes.some(prefix => imp.startsWith(prefix)))
}

export function getExternalImportsFromFiles({
  srcFiles, distFiles, configFiles = [], tsconfigExtends = [],
}: {
  configFiles?: string[]
  distFiles: string[]
  srcFiles: string[]
  tsconfigExtends?: string[]
}): CheckSourceParams {
  const srcImportPaths: Record<string, string[]> = {}
  const distImportPaths: Record<string, string[]> = {}
  const distTypeImportPaths: Record<string, string[]> = {}
  const configImportPaths: Record<string, string[]> = {}
  for (const path of srcFiles) getImportsFromFile(path, srcImportPaths, srcImportPaths).flat()
  for (const path of configFiles) getImportsFromFile(path, configImportPaths, configImportPaths).flat()
  const distTypeFiles = distFiles.filter(file => file.endsWith('.d.ts') || file.endsWith('.d.cts') || file.endsWith('.d.mts'))
  const distCodeFiles = distFiles.filter(file => !(file.endsWith('.d.ts') || file.endsWith('.d.cts') || file.endsWith('.d.mts')))
  for (const path of distCodeFiles) getImportsFromFile(path, distImportPaths, distImportPaths).flat()
  for (const path of distTypeFiles) getImportsFromFile(path, distTypeImportPaths, distTypeImportPaths).flat()
  const srcImports = Object.keys(srcImportPaths)
  const distImports = Object.keys(distImportPaths)
  const distTypeImports = Object.keys(distTypeImportPaths)

  const externalSrcImports = removeInternalImports(srcImports)
  const externalDistImports = removeInternalImports(distImports)
  const externalDistTypeImports = removeInternalImports(distTypeImports)
  const externalConfigImports = removeInternalImports(Object.keys(configImportPaths))

  // Tsconfig extends references count as used devDependencies
  for (const ext of tsconfigExtends) {
    if (!externalSrcImports.includes(ext)) externalSrcImports.push(ext)
    if (!externalConfigImports.includes(ext)) externalConfigImports.push(ext)
  }

  return {
    configImportPaths,
    srcImports,
    srcImportPaths,
    externalConfigImports,
    externalSrcImports,
    distImports,
    distImportPaths,
    externalDistImports,
    externalDistTypeImports,
  }
}
