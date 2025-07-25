import path from 'node:path'
import { cwd } from 'node:process'

import chalk from 'chalk'
import { rollup } from 'rollup'
import type { Options } from 'rollup-plugin-dts'
import dts from 'rollup-plugin-dts'
import nodeExternals from 'rollup-plugin-node-externals'

import { getCompilerOptions } from './getCompilerOptions.ts'

const ignoredWarningCodes = new Set(['EMPTY_BUNDLE', 'UNRESOLVED_IMPORT'])

export async function bundleDts(inputPath: string, outputPath: string, platform: 'node' | 'browser' | 'neutral', options?: Options, verbose = false) {
  // Find the tsconfig.json path
  const pkg = process.env.INIT_CWD ?? cwd()
  const tsconfigPath = path.resolve(pkg, 'tsconfig.json')

  const nodePlugIns = platform === 'node' ? [nodeExternals()] : []
  try {
    const bundle = await rollup({
      input: inputPath,

      plugins: [dts({
        ...options,
        tsconfig: tsconfigPath,
        compilerOptions: {
          emitDeclarationOnly: true, noEmit: false, declarationMap: true,
        },

      }), ...nodePlugIns],
      onwarn(warning, warn) {
        if (ignoredWarningCodes.has(warning.code ?? '')) {
          return
        }
        console.warn(chalk.yellow(`[${warning.code}] ${warning.message}`))
        console.warn(chalk.gray(inputPath))
        warn(warning)
      },
    })
    await bundle.write({
      file: outputPath,
      format: 'es',
    })
  } catch (ex) {
    const error = ex as Error
    console.warn(chalk.red(error))
    console.warn(chalk.gray(inputPath))
  }

  if (verbose) {
    console.log(`Bundled declarations written to ${outputPath}`)
  }
}

export const packageCompileTscTypes = async (
  entries: string[],
  outDir: string,
  platform: 'node' | 'browser' | 'neutral',
  srcDir: string = 'build',
  verbose = false,
): Promise<number> => {
  if (verbose) {
    console.log(chalk.cyan(`Compiling Types START [${platform}]: ${entries.length} files to ${outDir} from ${srcDir}`))
    console.log(`Entries: ${entries.join(', ')}`)
  }
  const pkg = process.env.INIT_CWD ?? cwd()
  const srcRoot = `${pkg}/${srcDir}/${platform}`

  const entryNameToTypeName = (entry: string): string => {
    const splitEntryName = entry.split('.')
    const newEntryExtension = 'd.' + splitEntryName.at(-1)
    return [...splitEntryName.slice(0, -1), newEntryExtension].join('.')
  }

  const compilerOptions = getCompilerOptions({
    removeComments: false,
    skipDefaultLibCheck: true,
    skipLibCheck: true,
    declarationMap: true,
    emitDeclarationOnly: true,
    noEmit: true,
  })

  const entryNames = entries.map(entry => entry.split(`${srcDir}/`).at(-1) ?? entry)

  await Promise.all(entryNames.map(async (entryName) => {
    const entryTypeName = entryNameToTypeName(entryName)
    await bundleDts(`${srcRoot}/${entryTypeName}`, `${outDir}/${entryTypeName}`, platform, { compilerOptions }, verbose)
  }))

  if (verbose) {
    console.log(chalk.cyan(`Compiling Types FINISH: ${entries.length} files to ${outDir} from ${srcDir}`))
  }

  return 0
}
