import { existsSync, PathLike, readFileSync, WriteFileOptions, writeFileSync } from 'node:fs'

import { notEmpty } from '../string'
import { CROSS_PLATFORM_NEWLINE, WINDOWS_NEWLINE_REGEX } from './constants'
import { defaultReadFileSyncOptions, ReadFileSyncOptions } from './ReadFileSyncOptions'

export const readLines = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string[] =>
  existsSync(uri) ? readFileSync(uri, options).replace(WINDOWS_NEWLINE_REGEX, CROSS_PLATFORM_NEWLINE).split(CROSS_PLATFORM_NEWLINE) : []

export const readNonEmptyLines = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string[] =>
  readLines(uri, options).filter(notEmpty)

export const writeLines = (uri: PathLike, entries: string[], options: WriteFileOptions = defaultReadFileSyncOptions) =>
  writeFileSync(uri, entries.join(CROSS_PLATFORM_NEWLINE), options)
