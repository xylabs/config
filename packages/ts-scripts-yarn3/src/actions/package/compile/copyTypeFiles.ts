import {
  copyFile, readdir,
} from 'node:fs/promises'

import { Mutex } from 'async-mutex'
import type { TsConfigCompilerOptions } from 'tsc-prog'

const copyFileMutex = new Mutex()

const getDistTypeFiles = async (compilerOptions: TsConfigCompilerOptions) => {
  const outDir = compilerOptions.outDir ?? 'dist'
  return (await readdir(outDir, { recursive: true })).filter(file => file.endsWith('d.ts')).map(file => `${outDir}/${file}`)
}

const getDistTypeMapFiles = async (compilerOptions: TsConfigCompilerOptions) => {
  const outDir = compilerOptions.outDir ?? 'dist'
  return (await readdir(outDir, { recursive: true })).filter(file => file.endsWith('d.ts.map')).map(file => `${outDir}/${file}`)
}

export const copyTypeFiles = async (compilerOptions: TsConfigCompilerOptions) => {
  // using a mutex since sometimes two compiles are running at once and cause a lock on windows
  await copyFileMutex.runExclusive(async () => {
    // hybrid packages want two copies of the types
    const distTypeFiles = await getDistTypeFiles(compilerOptions)
    await Promise.all(
      distTypeFiles.map(async (file) => {
        await copyFile(file, file.replace('d.ts', 'd.mts'))
        await copyFile(file, file.replace('d.ts', 'd.cts'))
      }),
    )

    const distTypeMapFiles = await getDistTypeMapFiles(compilerOptions)
    await Promise.all(
      distTypeMapFiles.map(async (file) => {
        await copyFile(file, file.replace('d.ts.map', 'd.mts.map'))
        await copyFile(file, file.replace('d.ts.map', 'd.cts.map'))
      }),
    )
  })
}
