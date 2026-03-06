import type { CheckSourceParams } from './checkPackage/index.ts'
import { getImportsFromFile } from './getImportsFromFile.ts'

const internalImportPrefixes = ['.', '#', 'node:']

const removeInternalImports = (imports: string[]) => {
  return imports.filter(imp => !internalImportPrefixes.some(prefix => imp.startsWith(prefix)))
}

const isDeclarationFile = (file: string) =>
  file.endsWith('.d.ts') || file.endsWith('.d.cts') || file.endsWith('.d.mts')

export function getExternalImportsFromFiles({
  allFiles, distFiles, tsconfigExtends = [],
}: {
  allFiles: string[]
  distFiles: string[]
  tsconfigExtends?: string[]
}): CheckSourceParams {
  const allImportPaths: Record<string, string[]> = {}
  const distImportPaths: Record<string, string[]> = {}
  const distTypeImportPaths: Record<string, string[]> = {}

  for (const path of allFiles) getImportsFromFile(path, allImportPaths, allImportPaths).flat()

  const distTypeFiles = distFiles.filter(isDeclarationFile)
  const distCodeFiles = distFiles.filter(file => !isDeclarationFile(file))
  for (const path of distCodeFiles) getImportsFromFile(path, distImportPaths, distImportPaths).flat()
  for (const path of distTypeFiles) getImportsFromFile(path, distTypeImportPaths, distTypeImportPaths).flat()

  const allImports = Object.keys(allImportPaths)
  const distImports = Object.keys(distImportPaths)

  const externalAllImports = removeInternalImports(allImports)
  const externalDistImports = removeInternalImports(distImports)
  const externalDistTypeImports = removeInternalImports(Object.keys(distTypeImportPaths))

  // Tsconfig extends references count as used imports
  for (const ext of tsconfigExtends) {
    if (!externalAllImports.includes(ext)) externalAllImports.push(ext)
  }

  return {
    allImportPaths,
    allImports,
    distImportPaths,
    distImports,
    externalAllImports,
    externalDistImports,
    externalDistTypeImports,
  }
}
