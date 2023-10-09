export interface RootParams {
  verbose?: boolean
}

export type EntryMode = 'all' | 'single' | 'auto' | 'platform'

export interface CompileParams extends RootParams {
  compile?: {
    depth?: number
    /** @param entryMode all, single, platform, or auto */
    entryMode?: EntryMode
    /** @param files Manually specify the files to be compiled */
    files?: string[]
    publint?: boolean
  }
}
