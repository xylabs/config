import type { Loader } from 'esbuild'
import type { Options } from 'tsup'
import { build, defineConfig } from 'tsup'

import { buildEntries } from './buildEntries.ts'
import { packageCompileTypes } from './compileTypes.ts'
import { deepMergeObjects } from './deepMerge.ts'
import { packageCompileTsc } from './packageCompileTsc.ts'
import type { EntryMode, XyTsupConfig } from './XyConfig.ts'

const compileFolder = async (
  folder: string,
  entryMode: EntryMode = 'single',
  options?: Options,
  verbose?: boolean,
): Promise<number> => {
  const outDir = options?.outDir ?? 'dist'

  if (verbose) {
    console.log(`compileFolder [${folder}]`)
  }

  const entry = buildEntries(folder, entryMode)
  const optionsResult = defineConfig({
    bundle: true,
    cjsInterop: true,
    clean: true,
    dts: false,
    entry,
    format: ['esm'],
    outDir,
    silent: true,
    sourcemap: true,
    splitting: false,
    tsconfig: 'tsconfig.json',
    ...options,
  })
  const optionsList = (
    await Promise.all(
      (Array.isArray(optionsResult) ? optionsResult : [optionsResult]).flatMap<Promise<Options[]>>(async (options) => {
        const result = typeof options === 'function' ? await options({}) : [options]
        return Array.isArray(result) ? result : [result]
      }),
    )
  ).flat()

  if (verbose) {
    console.log(`TSUP:build:start [${folder}]`)
  }

  await Promise.all(optionsList.map(options => build(options)))

  if (verbose) {
    console.log(`TSUP:build:stop [${folder}]`)
  }

  return 0
}

export const tsupOptions = (options: Options[] = []): Options => {
  const standardLoaders: Record<string, Loader> = {
    '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'copy', '.webp': 'copy',
  }

  const standardOptions: Options = {
    bundle: true,
    format: ['esm'],
    loader: standardLoaders,
    outExtension: ({ format }) => (format === 'esm' ? { js: '.mjs' } : { js: '.cjs' }),
    skipNodeModulesBundle: true,
    sourcemap: true,
    target: 'esnext',
  }

  return deepMergeObjects([standardOptions, ...options])
}

export const packageCompileTsup = async (config?: XyTsupConfig) => {
  const compile = config?.compile
  const verbose = config?.verbose ?? false
  if (verbose) {
    console.log(`Compiling with TSUP [Depth: ${compile?.depth}]`)
  }

  const compileForNode = compile?.node ?? { src: {} }
  const compileForBrowser = compile?.browser ?? { src: {} }
  const compileForNeutral = compile?.neutral ?? { src: {} }

  if (verbose) {
    console.log('Calling packageCompileTscTypes')
  }

  let errors = await packageCompileTypes(config)
  errors = errors + packageCompileTsc(undefined, config)
  if (errors > 0) {
    return errors
  }

  return (
    (
      await Promise.all(
        Object.entries(compileForNode).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.node?.esbuildOptions === 'object' ? compile?.node?.esbuildOptions : {}
          return typeof folder === 'string'
            ? await compileFolder(
                folder,
                compile?.entryMode,
                tsupOptions([inEsBuildOptions,
                  compile?.tsup?.options ?? {},
                  (typeof options === 'object' ? options : {}),
                  { platform: 'node', outDir: 'dist/node' }]),
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    + (
      await Promise.all(
        Object.entries(compileForBrowser).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.browser?.esbuildOptions === 'object' ? compile?.browser?.esbuildOptions : {}
          return typeof folder === 'string'
            ? await compileFolder(
                folder,
                compile?.entryMode,
                tsupOptions([inEsBuildOptions,
                  compile?.tsup?.options ?? {},
                  (typeof options === 'object' ? options : {}),
                  { platform: 'browser', outDir: 'dist/browser' }]),
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    + (
      await Promise.all(
        Object.entries(compileForNeutral).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.neutral?.esbuildOptions === 'object' ? compile?.neutral?.esbuildOptions : {}
          return typeof folder === 'string'
            ? await compileFolder(
                folder,
                compile?.entryMode,
                tsupOptions([inEsBuildOptions,
                  compile?.tsup?.options ?? {},
                  (typeof options === 'object' ? options : {}),
                  { platform: 'neutral', outDir: 'dist/neutral' }]),
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    + 0
  )
}
