export type ReadFileSyncOptions = BufferEncoding | {
  encoding: BufferEncoding
  flags?: string
}

export const defaultReadFileSyncOptions: ReadFileSyncOptions = { encoding: 'utf8' }
