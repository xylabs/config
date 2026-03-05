export interface CheckPackageParams {
  dependencies: string[]
  devDependencies: string[]
  peerDependencies: string[]
}

export interface CheckSourceParams {
  configImportPaths: Record<string, string[]>
  distImportPaths: Record<string, string[]>
  distImports: string[]
  externalConfigImports: string[]
  externalDistImports: string[]
  externalDistTypeImports: string[]
  externalSrcImports: string[]
  srcImportPaths: Record<string, string[]>
  srcImports: string[]
}
