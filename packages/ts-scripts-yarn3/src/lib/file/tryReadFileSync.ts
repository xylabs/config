import type { PathLike } from 'node:fs'
import { existsSync, readFileSync } from 'node:fs'

import type { ReadFileSyncOptions } from './ReadFileSyncOptions.ts'
import { defaultReadFileSyncOptions } from './ReadFileSyncOptions.ts'

export const tryReadFileSync = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string | undefined => {
  return existsSync(uri) ? readFileSync(uri, options) : undefined
}
