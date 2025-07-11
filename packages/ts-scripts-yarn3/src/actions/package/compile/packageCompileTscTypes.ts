import { cwd } from 'node:process'

import { rollup } from 'rollup'
import type { Options } from 'rollup-plugin-dts'
import dts from 'rollup-plugin-dts'
import nodeExternals from 'rollup-plugin-node-externals'
import type { TsConfigCompilerOptions } from 'tsc-prog'
import type ts from 'typescript'

import { getCompilerOptions } from './getCompilerOptions.ts'

export async function bundleDts(inputPath: string, outputPath: string, platform: 'node' | 'browser' | 'neutral', options?: Options) {
  const nodePlugIns = platform === 'node' ? [nodeExternals()] : []
  const bundle = await rollup({
    input: inputPath,
    plugins: [dts(options), ...nodePlugIns],
    onwarn(warning, warn) {
      // Ignore certain warnings if needed
      if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
      warn(warning)
    },
  })

  await bundle.write({
    file: outputPath,
    format: 'es',
  })

  console.log(`Bundled declarations written to ${outputPath}`)
}

export const packageCompileTscTypes = async (
  entries: string[],
  outDir: string,
  platform: 'node' | 'browser' | 'neutral',
  folder: string = 'src',
): Promise<number> => {
  const pkg = process.env.INIT_CWD ?? cwd()
  const srcRoot = `${pkg}/${folder}`

  const entryNameToTypeName = (entry: string): string => {
    const splitEntryName = entry.split('.')
    const newEntryExtension = 'd.' + splitEntryName.at(-1)
    return [...splitEntryName.slice(0, -1), newEntryExtension].join('.')
  }

  const compilerOptions = {
    removeComments: false,
    skipDefaultLibCheck: true,
    skipLibCheck: true,
    sourceMap: false,
    emitDeclarationOnly: false,
    noEmit: true,
  } as ts.CompilerOptions

  const entryNames = entries.map(entry => entry.split(`${folder}/`).at(-1) ?? entry)

  await Promise.all(entryNames.map(async (entryName) => {
    await bundleDts(`${srcRoot}/${entryName}`, outDir + '/' + entryNameToTypeName(entryName), platform, { compilerOptions, tsconfig: 'tsconfig.json' })
  }))
  return 0
}
