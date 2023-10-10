import type { PackageCompileTsupParams } from '@xylabs/ts-scripts-yarn3'

export interface LiveShareConfig {
  exclude?: string[]
  include?: string[]
}

export interface XyConfig {
  compile?: PackageCompileTsupParams['compile']
  liveShare?: LiveShareConfig
}
