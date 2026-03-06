export interface CheckPackageParams {
  dependencies: string[]
  devDependencies: string[]
  peerDependencies: string[]
}

export interface CheckSourceParams {
  allImportPaths: Record<string, string[]>
  allImports: string[]
  distImportPaths: Record<string, string[]>
  distImports: string[]
  externalAllImports: string[]
  externalDistImports: string[]
  externalDistTypeImports: string[]
}
