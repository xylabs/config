import type { CheckSourceParams } from './checkPackage/index.ts'
import { getImportsFromFile } from './getImportsFromFile.ts'

const internalImportPrefixes = ['.', '#', 'node:']

const removeInternalImports = (imports: string[]) => {
  return imports.filter(imp => !internalImportPrefixes.some(prefix => imp.startsWith(prefix)))
}

export function getExternalImportsFromFiles({ srcFiles, distFiles }: { distFiles: string []; srcFiles: string[] }): CheckSourceParams {
  const srcImportPaths: Record<string, string[]> = {}
  const distImportPaths: Record<string, string[]> = {}
  for (const path of srcFiles) getImportsFromFile(path, srcImportPaths, srcImportPaths).flat()
  for (const path of distFiles) getImportsFromFile(path, distImportPaths, distImportPaths).flat()
  const srcImports = Object.keys(srcImportPaths)
  const distImports = Object.keys(distImportPaths)

  const externalSrcImports = removeInternalImports(srcImports)
  const externalDistImports = removeInternalImports(distImports)

  return {
    srcImports,
    srcImportPaths,
    externalSrcImports,
    distImports,
    distImportPaths,
    externalDistImports,
  }
}
