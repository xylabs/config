export interface RootParams {
  verbose?: boolean
}

export interface CompileParams extends RootParams {
  compile?: {
    depth?: number
    publint?: boolean
  }
}
