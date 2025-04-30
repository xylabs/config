export interface CheckPackageParams {
  dependencies: string[]
  devDependencies: string[]
  peerDependencies: string[]
}

export interface CheckSourceParams {
  devImportPaths: Record<string, string[]>
  externalDevImports: string[]
  externalProdImports: string[]
  externalProdTypeImports: string[]
  prodImportPaths: Record<string, string[]>
  prodTypeImportPaths: Record<string, string[]>
}
