export interface CheckPackageParams {
  dependencies: string[]
  devDependencies: string[]
  peerDependencies: string[]
}

export interface CheckSourceParams {
  distImportPaths: Record<string, string[]>
  distImports: string[]
  externalDistImports: string[]
  externalDistTypeImports: string[]
  externalSrcImports: string[]
  srcImportPaths: Record<string, string[]>
  srcImports: string[]
}
