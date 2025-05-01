import { getImportsFromFile } from './getImportsFromFile.ts'

const internalImportPrefixes = ['.', '#', 'node:']

const removeInternalImports = (imports: string[]) => {
  return imports.filter(imp => !internalImportPrefixes.some(prefix => imp.startsWith(prefix)))
}

export function getExternalImportsFromFiles({
  prodSourceFiles, devSourceFiles, prodDistFiles,
}: { devSourceFiles: string[]; prodDistFiles: string []; prodSourceFiles: string[] }) {
  const prodImportPaths: Record<string, string[]> = {}
  const prodTypeImportPaths: Record<string, string[]> = {}
  const prodImportPairs = prodSourceFiles.map(path => getImportsFromFile(path, prodImportPaths, prodTypeImportPaths))
  const prodTypeImportPairs = prodDistFiles.map(path => getImportsFromFile(path, prodImportPaths, prodTypeImportPaths))
  const prodImports = prodImportPairs.flatMap(pair => pair[0])
  const prodTypeImports = prodTypeImportPairs.flatMap(pair => pair[1])

  const devImportPaths: Record<string, string[]> = {}
  const devTypeImportPaths: Record<string, string[]> = {}
  const devImportPairs = devSourceFiles.map(path => getImportsFromFile(path, devImportPaths, devTypeImportPaths))
  const devImports = devImportPairs.flatMap(pair => pair[0])
  const devTypeImports = devImportPairs.flatMap(pair => pair[1])

  const externalProdImports = removeInternalImports(prodImports)
  const externalProdTypeImports = removeInternalImports(prodTypeImports)
  const externalDevImports = removeInternalImports(devImports)
  return {
    prodImports,
    devImports,
    prodImportPaths,
    prodTypeImportPaths,
    devImportPaths,
    externalProdImports,
    externalDevImports,
    prodTypeImports,
    devTypeImports,
    externalProdTypeImports,
  }
}
