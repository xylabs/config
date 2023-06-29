import { existsSync, PathLike, readFileSync } from 'node:fs'

import { defaultReadFileSyncOptions, ReadFileSyncOptions } from './ReadFileSyncOptions'

export const tryReadFileSync = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string | undefined => {
  return existsSync(uri) ? readFileSync(uri, options) : undefined
}
