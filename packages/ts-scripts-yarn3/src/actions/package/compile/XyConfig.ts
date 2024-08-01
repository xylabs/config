import { Options } from 'tsup'

export type EntryMode = 'all' | 'single' | 'auto' | 'platform'

export type CompileMode = 'tsup' | 'tsc'

export interface DirectoryPathConfig {
  /**
   * Glob patterns to exclude (takes precedence over include).
   */
  exclude?: string[]
  /**
   * Glob patterns to include.
   */
  include?: string[]
}

/**
 * Configuration for Dynamic Share.
 */
export interface DynamicShareConfig extends DirectoryPathConfig {}

/**
 * Configuration for Live Share.
 */
export interface LiveShareConfig extends DirectoryPathConfig {}

export interface CompileConfig {
  depth?: number
  /** @param entryMode all, single, platform, or auto */
  entryMode?: EntryMode
  /** @param files Manually specify the files to be compiled */
  files?: string[]
  mode?: CompileMode
}

export type PackageCompileTsupConfig = CompileConfig & {
  browser?: Record<string, Options | boolean>
  mode?: 'tsup'
  neutral?: Record<string, Options | boolean>
  node?: Record<string, Options | boolean>
  tsup?: {
    options?: Options
  }
}

export type PackageCompileTscConfig = CompileConfig & {
  mode: 'tsc'
}

export interface XyConfigBase {
  compile?: CompileConfig
  dynamicShare?: DynamicShareConfig
  liveShare?: LiveShareConfig
  publint?: boolean
  verbose?: boolean
}

export interface XyTsupConfig extends XyConfigBase {
  compile?: PackageCompileTsupConfig
}

export interface XyTscConfig extends XyConfigBase {
  compile?: PackageCompileTscConfig
}

export type XyConfig = XyTsupConfig | XyTscConfig
