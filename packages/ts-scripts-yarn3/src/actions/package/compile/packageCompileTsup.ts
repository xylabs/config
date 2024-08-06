import type { Loader } from 'esbuild'
import { build, defineConfig, Options } from 'tsup'

import { packagePublint } from '../publint.ts'
import { buildEntries } from './buildEntries.ts'
import { packageCompileTsc } from './packageCompileTsc.ts'
import { packageCompileTscTypes } from './packageCompileTscTypes.ts'
import { EntryMode, XyTsupConfig } from './XyConfig.ts'

const compileFolder = async (folder: string, entryMode: EntryMode = 'single', options?: Options, verbose?: boolean) => {
  const outDir = options?.outDir ?? 'dist'
  const entry = buildEntries(folder, entryMode)
  const optionsResult = defineConfig({
    bundle: true,
    cjsInterop: true,
    clean: true,
    dts: true,
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

  await Promise.all(optionsList.map(options => build(options)))
  // packageCompileTscTypes(folder, { verbose }, { outDir })

  return 0
}

// eslint-disable-next-line complexity
export const packageCompileTsup = async (config?: XyTsupConfig) => {
  const compile = config?.compile
  const publint = config?.publint ?? true
  const verbose = config?.verbose ?? false
  if (verbose) {
    console.log(`Compiling with TSUP [Depth: ${compile?.depth}]`)
  }

  const compileForNode = compile?.node ?? { src: {} }
  const compileForBrowser = compile?.browser ?? { src: {} }
  const compileForNeutral = compile?.neutral ?? { src: {} }

  const standardLoaders: Record<string, Loader> = { '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' }
  const standardOptions: Options = {
    bundle: true,
    format: ['esm'],
    loader: standardLoaders,
    outExtension: ({ format }) => (format === 'esm' ? { js: '.mjs' } : { js: '.cjs' }),
    skipNodeModulesBundle: true,
    sourcemap: true,
    target: 'esnext',
  }

  return (
    (await packageCompileTsc(true, { publint: false, verbose }))
    || (
      await Promise.all(
        Object.entries(compileForNode).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.node?.esbuildOptions === 'object' ? compile?.node?.esbuildOptions : {}
          return folder
            ? await compileFolder(
              folder,
              compile?.entryMode,
              {
                ...standardOptions,
                loader: {
                  ...standardOptions.loader,
                  ...inEsBuildOptions?.loader,
                },
                outDir: 'dist/node',
                platform: 'node',
                ...compile?.tsup?.options,
                ...(typeof options === 'object' ? options : {}),
              },
              verbose,
            )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    || (
      await Promise.all(
        Object.entries(compileForBrowser).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.browser?.esbuildOptions === 'object' ? compile?.browser?.esbuildOptions : {}
          return folder
            ? await compileFolder(
              folder,
              compile?.entryMode,
              {
                ...standardOptions,
                loader: {
                  ...standardOptions.loader,
                  ...inEsBuildOptions?.loader,
                },
                outDir: 'dist/browser',
                platform: 'browser',
                ...compile?.tsup?.options,
                ...(typeof options === 'object' ? options : {}),
              },
              verbose,
            )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    || (
      await Promise.all(
        Object.entries(compileForNeutral).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.neutral?.esbuildOptions === 'object' ? compile?.neutral?.esbuildOptions : {}
          return folder
            ? await compileFolder(
              folder,
              compile?.entryMode,
              {
                ...standardOptions,
                loader: {
                  ...standardOptions.loader,
                  ...inEsBuildOptions?.loader,
                },
                outDir: 'dist/neutral',
                platform: 'neutral',
                ...compile?.tsup?.options,
                ...(typeof options === 'object' ? options : {}),
              },
              verbose,
            )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    || (publint ? await packagePublint() : 0)
  )
}
