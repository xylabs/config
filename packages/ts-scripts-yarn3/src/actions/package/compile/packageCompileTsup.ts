import chalk from 'chalk'
import type { Loader } from 'esbuild'
import type { Options } from 'tsup'
import { build, defineConfig } from 'tsup'

import { buildEntries } from './buildEntries.ts'
import { deepMergeObjects } from './deepMerge.ts'
import { packageCompileTsc } from './packageCompileTsc.ts'
import { packageCompileTscTypes } from './packageCompileTscTypes.ts'
import type { XyTsupConfig } from './XyConfig.ts'

const compileFolder = async (
  srcDir: string,
  entries: string[],
  buildDir: string,
  options?: Options,
  bundleTypes = false,
  verbose?: boolean,
): Promise<number> => {
  const outDir = options?.outDir ?? 'dist'

  if (verbose) {
    console.log(`compileFolder [${srcDir}, ${options?.outDir}]`)
  }

  if (entries.length === 0) {
    console.warn(chalk.yellow(`No entries found in ${srcDir} to compile`))
    return 0
  }

  if (verbose) {
    console.log(chalk.gray(`buildDir [${buildDir}]`))
  }

  const validationResult = packageCompileTsc(options?.platform ?? 'neutral', entries, srcDir, buildDir, undefined, verbose)
  if (validationResult !== 0) {
    console.error(chalk.red(`Compile:Validation had ${validationResult} errors`))
    return validationResult
  }

  const optionsParams: Options = tsupOptions([{
    bundle: true,
    cjsInterop: true,
    clean: false,
    dts: false,
    format: ['esm'],
    outDir,
    silent: true,
    sourcemap: true,
    splitting: false,
    tsconfig: 'tsconfig.json',
    ...options,
    entry: entries.map(entry => `${srcDir}/${entry}`),
  }])

  const optionsResult = defineConfig(optionsParams)

  const optionsList = (
    await Promise.all(
      (Array.isArray(optionsResult) ? optionsResult : [optionsResult]).flatMap<Promise<Options[]>>(async (options) => {
        const result = typeof options === 'function' ? await options({}) : [options]
        return Array.isArray(result) ? result : [result]
      }),
    )
  ).flat()

  if (verbose) {
    console.log(chalk.cyan(`TSUP:build:start [${srcDir}]`))
    console.log(chalk.gray(`TSUP:build:options [${JSON.stringify(optionsList, null, 2)}]`))
  }

  await Promise.all(optionsList.map(options => build(options)))

  if (verbose) {
    console.log(chalk.cyan(`TSUP:build:stop [${srcDir}]`))
  }
  if (bundleTypes) {
    await packageCompileTscTypes(entries, outDir, options?.platform ?? 'neutral', buildDir, verbose)
  }

  return 0
}

export const tsupOptions = (options: Options[] = []): Options => {
  const standardLoaders: Record<string, Loader> = {
    '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'text', '.webp': 'copy',
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
  const outDirAsBuildDir = compile?.outDirAsBuildDir ?? true
  const bundleTypes = compile?.bundleTypes ?? false
  if (verbose) {
    console.log('Compiling with TSUP')
  }

  const compileForNode = compile?.node ?? { src: {} }
  const compileForBrowser = compile?.browser ?? { src: {} }
  const compileForNeutral = compile?.neutral ?? { src: {} }

  return (
    (
      await Promise.all(
        Object.entries(compileForNode).map(async ([srcDir, options]) => {
          const optionsObject: Options = typeof options === 'object' ? options : {}
          const inEsBuildOptions = typeof compile?.node?.esbuildOptions === 'object' ? compile?.node?.esbuildOptions : {}
          const entry = buildEntries(srcDir, compile?.entryMode, options, true, verbose)
          const platform = 'node'
          const rootOutDir = (optionsObject.outDir ?? 'dist')
          const outDir = rootOutDir + '/' + platform
          return typeof srcDir === 'string'
            ? await compileFolder(
                srcDir,
                entry,
                outDirAsBuildDir ? rootOutDir : 'build',
                tsupOptions([inEsBuildOptions,
                  compile?.tsup?.options ?? {},
                  (typeof options === 'object' ? options : {}),
                  { platform: 'node', outDir }]),
                bundleTypes,
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    + (
      await Promise.all(
        Object.entries(compileForBrowser).map(async ([srcDir, options]) => {
          const optionsObject: Options = typeof options === 'object' ? options : {}
          const inEsBuildOptions = typeof compile?.browser?.esbuildOptions === 'object' ? compile?.browser?.esbuildOptions : {}
          const entry = buildEntries(srcDir, compile?.entryMode, options, true, verbose)
          const platform = 'browser'
          const rootOutDir = (optionsObject.outDir ?? 'dist')
          const outDir = rootOutDir + '/' + platform
          return typeof srcDir === 'string'
            ? await compileFolder(
                srcDir,
                entry,
                outDirAsBuildDir ? rootOutDir : 'build',
                tsupOptions([inEsBuildOptions,
                  compile?.tsup?.options ?? {},
                  (typeof options === 'object' ? options : {}),
                  { platform: 'browser', outDir }]),
                bundleTypes,
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    + (
      await Promise.all(
        Object.entries(compileForNeutral).map(async ([srcDir, options]) => {
          const optionsObject: Options = typeof options === 'object' ? options : {}
          const inEsBuildOptions = typeof compile?.neutral?.esbuildOptions === 'object' ? compile?.neutral?.esbuildOptions : {}
          const entry = buildEntries(srcDir, compile?.entryMode, options, true, verbose)
          const platform = 'neutral'
          const rootOutDir = (optionsObject.outDir ?? 'dist')
          const outDir = rootOutDir + '/' + platform
          return typeof srcDir === 'string'
            ? await compileFolder(
                srcDir,
                entry,
                outDirAsBuildDir ? rootOutDir : 'build',
                tsupOptions([inEsBuildOptions,
                  compile?.tsup?.options ?? {},
                  (typeof options === 'object' ? options : {}),
                  { platform: 'neutral', outDir }]),
                bundleTypes,
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0)
    + 0
  )
}
