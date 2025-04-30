import { getImportsFromFile } from './getImportsFromFile.ts'

export function getExternalImportsFromFiles({ prodSourceFiles, devSourceFiles }: { devSourceFiles: string[]; prodSourceFiles: string[] }) {
  const prodImportPaths: Record<string, string[]> = {}
  const prodTypeImportPaths: Record<string, string[]> = {}
  const prodImportPairs = prodSourceFiles.map(path => getImportsFromFile(path, prodImportPaths, prodTypeImportPaths))
  const prodImports = prodImportPairs.flatMap(pair => pair[0])
  const prodTypeImports = prodImportPairs.flatMap(pair => pair[1])

  const devImportPaths: Record<string, string[]> = {}
  const devTypeImportPaths: Record<string, string[]> = {}
  const devImportPairs = devSourceFiles.map(path => getImportsFromFile(path, devImportPaths, devTypeImportPaths))
  const devImports = devImportPairs.flatMap(pair => pair[0])
  const devTypeImports = devImportPairs.flatMap(pair => pair[1])

  const externalProdImports = prodImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
  const externalProdTypeImports = prodTypeImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
  const externalDevImports = devImports.filter(imp => !imp.startsWith('.') && !imp.startsWith('#') && !imp.startsWith('node:'))
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
