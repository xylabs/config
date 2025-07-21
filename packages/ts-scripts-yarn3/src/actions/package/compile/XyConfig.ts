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
  /** @param when building types with tsc, should it use the outDir to write to? */
  outDirAsBuildDir?: boolean
}

export type PackageCompileTsupConfig = CompileConfig & {
  browser?: Record<string, Options | boolean>
  neutral?: Record<string, Options | boolean>
  node?: Record<string, Options | boolean>
  tsup?: { options?: Options }
  verbose?: boolean
}

export type PackageCompileTscConfig = CompileConfig & { mode: 'tsc' }

export interface XyConfigBase {
  compile?: CompileConfig
  dynamicShare?: DynamicShareConfig
  liveShare?: LiveShareConfig

  /** @deprecated */
  publint?: boolean

  verbose?: boolean
}

export interface XyTsupConfig extends XyConfigBase { compile?: PackageCompileTsupConfig }

export interface XyTscConfig extends XyConfigBase { compile?: PackageCompileTscConfig }

export type XyConfigLegacy = XyTsupConfig | XyTscConfig

export type XyConfig = XyConfigLegacy & {
  dev?: {
    build?: {
      clean?: boolean /* default: true */
      compile?: boolean /* default: true */
      deplint?: boolean /* default: true */
      gendocs?: boolean /* default: false */
      gitlint?: boolean /* default: true */
      knip?: boolean /* default: true */
      license?: boolean /* default: true */
      lint?: boolean /* default: true */
      publint?: boolean /* default: true */
      statics?: boolean /* default: true */
      verbose?: boolean
    }
    compile?: PackageCompileTsupConfig
    verbose?: boolean
  }
  verbose?: boolean
}
