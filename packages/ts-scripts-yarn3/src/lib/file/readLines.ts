import { existsSync, PathLike, readFileSync } from 'node:fs'

import { notEmpty } from '../string'
import { CROSS_PLATFORM_NEWLINE, WINDOWS_NEWLINE_REGEX } from './constants'
import { defaultReadFileSyncOptions, ReadFileSyncOptions } from './ReadFileSyncOptions'

export const readLines = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string[] => {
  return existsSync(uri) ? readFileSync(uri, options).replace(WINDOWS_NEWLINE_REGEX, CROSS_PLATFORM_NEWLINE).split(CROSS_PLATFORM_NEWLINE) : []
}

export const readNonEmptyLines = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string[] => {
  return readLines(uri, options).filter(notEmpty)
}
