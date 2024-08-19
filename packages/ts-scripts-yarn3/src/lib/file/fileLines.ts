import type { PathLike, WriteFileOptions } from 'node:fs'
import {
  existsSync, readFileSync, writeFileSync,
} from 'node:fs'

import { notEmpty } from '../string/index.ts'
import { CROSS_PLATFORM_NEWLINE, WINDOWS_NEWLINE_REGEX } from './constants.ts'
import type { ReadFileSyncOptions } from './ReadFileSyncOptions.ts'
import { defaultReadFileSyncOptions } from './ReadFileSyncOptions.ts'

export const readLines = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string[] =>
  existsSync(uri)
    ? readFileSync(uri, options).replace(WINDOWS_NEWLINE_REGEX, CROSS_PLATFORM_NEWLINE).split(CROSS_PLATFORM_NEWLINE)
    : []

export const readNonEmptyLines = (uri: PathLike, options: ReadFileSyncOptions = defaultReadFileSyncOptions): string[] =>
  readLines(uri, options).filter(notEmpty)

export const writeLines = (uri: PathLike, lines: string[], options: WriteFileOptions = defaultReadFileSyncOptions) => {
  const existing = existsSync(uri) ? readFileSync(uri, options) : undefined
  const desired = lines.join(CROSS_PLATFORM_NEWLINE)
  // Check if the file is different before writing
  if (existing !== desired) writeFileSync(uri, desired, options)
}
