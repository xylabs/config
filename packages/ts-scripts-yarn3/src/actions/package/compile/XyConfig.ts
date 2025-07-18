import type { Options } from 'tsup'

export type EntryMode = 'all' | 'single' | 'auto' | 'platform' | 'custom'

/**
 * Configuration for specifying which paths are targeted.
 */
export interface PathConfig {
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

export interface DynamicShareConfig extends PathConfig {}

/**
 * Configuration for Live Share.
 */

export interface LiveShareConfig extends PathConfig {}

export interface CompileConfig {
  bundleTypes?: boolean
  /** @param entryMode all, single, custom, platform, or auto */
  entryMode?: EntryMode
  outDirAsBuildDir?: boolean
}

export type PackageCompileTsupConfig = CompileConfig & {
  browser?: Record<string, Options | boolean>
  neutral?: Record<string, Options | boolean>
  node?: Record<string, Options | boolean>
  tsup?: { options?: Options }
}

export type PackageCompileTscConfig = CompileConfig & { mode: 'tsc' }

export interface XyConfigBase {
  compile?: CompileConfig
  dynamicShare?: DynamicShareConfig
  liveShare?: LiveShareConfig
  publint?: boolean
  verbose?: boolean
}

export interface XyTsupConfig extends XyConfigBase { compile?: PackageCompileTsupConfig }

export interface XyTscConfig extends XyConfigBase { compile?: PackageCompileTscConfig }

export type XyConfig = XyTsupConfig | XyTscConfig
