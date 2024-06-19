import { merge } from 'lodash'
import { build, defineConfig, Options } from 'tsup'

import { packagePublint } from '../publint'
import { buildEntries } from './buildEntries'
import { packageCompileTsc } from './packageCompileTsc'
import { packageCompileTscTypes } from './packageCompileTscTypes'
import { EntryMode, XyTsupConfig } from './XyConfig'

const compileFolder = async (folder: string, entryMode: EntryMode = 'single', options?: Options, verbose?: boolean) => {
  const outDir = options?.outDir ?? 'dist'
  const entry = buildEntries(folder, entryMode)
  const optionsResult = defineConfig({
    bundle: true,
    cjsInterop: true,
    clean: true,
    dts: false,
    entry,
    format: ['cjs', 'esm'],
    minify: true,
    outDir,
    silent: true,
    sourcemap: true,
    splitting: false,
    terserOptions: { format: { comments: false }, output: { comments: false } },
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

  await Promise.all(optionsList.map((options) => build(options)))
  await packageCompileTscTypes(folder, { verbose }, { outDir })

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

  return (
    (await packageCompileTsc(true, { publint: false, verbose })) ||
    (
      await Promise.all(
        Object.entries(compileForNode).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.node?.esbuildOptions === 'object' ? compile?.node?.esbuildOptions : {}
          return folder ?
              await compileFolder(
                folder,
                compile?.entryMode,
                {
                  bundle: true,
                  format: ['cjs', 'esm'],
                  loader: merge(
                    {},
                    { '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' },
                    inEsBuildOptions?.loader,
                  ),
                  minify: true,
                  outDir: 'dist/node',
                  platform: 'node',
                  skipNodeModulesBundle: true,
                  target: 'node16',
                  terserOptions: { format: { comments: false }, output: { comments: false } },
                  ...compile?.tsup?.options,
                  ...(typeof options === 'object' ? options : {}),
                },
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0) ||
    (
      await Promise.all(
        Object.entries(compileForBrowser).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.browser?.esbuildOptions === 'object' ? compile?.browser?.esbuildOptions : {}
          return folder ?
              (
                await Promise.all([
                  compileFolder(
                    folder,
                    compile?.entryMode,
                    {
                      bundle: true,
                      format: ['cjs'],
                      loader: merge(
                        {},
                        { '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' },
                        inEsBuildOptions?.loader,
                      ),
                      minify: true,
                      outDir: 'dist/browser',
                      outExtension: ({ format }) => (format === 'esm' ? { js: '.js' } : { js: '.cjs' }),
                      platform: 'browser',
                      skipNodeModulesBundle: true,
                      target: 'esnext',
                      terserOptions: { format: { comments: false }, output: { comments: false } },
                      ...compile?.tsup?.options,
                      ...(typeof options === 'object' ? options : {}),
                    },
                    verbose,
                  ),
                  compileFolder(
                    folder,
                    compile?.entryMode,
                    {
                      bundle: true,
                      format: ['esm'],
                      loader: merge(
                        {},
                        { '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' },
                        inEsBuildOptions?.loader,
                      ),
                      minify: true,
                      outDir: 'dist/browser',
                      outExtension: ({ format }) => (format === 'esm' ? { js: '.js' } : { js: '.cjs' }),
                      platform: 'browser',
                      skipNodeModulesBundle: true,
                      target: 'esnext',
                      terserOptions: { format: { comments: false }, output: { comments: false } },
                      ...compile?.tsup?.options,
                      ...(typeof options === 'object' ? options : {}),
                    },
                    verbose,
                  ),
                ])
              ).reduce((prev, value) => prev + value, 0)
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0) ||
    (
      await Promise.all(
        Object.entries(compileForNeutral).map(async ([folder, options]) => {
          const inEsBuildOptions = typeof compile?.neutral?.esbuildOptions === 'object' ? compile?.neutral?.esbuildOptions : {}
          return folder ?
              (
                await Promise.all([
                  compileFolder(
                    folder,
                    compile?.entryMode,
                    {
                      bundle: true,
                      format: ['cjs'],
                      loader: merge(
                        {},
                        { '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' },
                        inEsBuildOptions?.loader,
                      ),
                      minify: true,
                      outDir: 'dist/neutral',
                      outExtension: ({ format }) => (format === 'esm' ? { js: '.js' } : { js: '.cjs' }),
                      platform: 'neutral',
                      skipNodeModulesBundle: true,
                      target: 'esnext',
                      terserOptions: { format: { comments: false }, output: { comments: false } },
                      ...compile?.tsup?.options,
                      ...(typeof options === 'object' ? options : {}),
                    },
                    verbose,
                  ),
                  compileFolder(
                    folder,
                    compile?.entryMode,
                    {
                      bundle: true,
                      format: ['esm'],
                      loader: merge(
                        {},
                        { '.gif': 'copy', '.html': 'copy', '.jpg': 'copy', '.json': 'json', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' },
                        inEsBuildOptions?.loader,
                      ),
                      minify: true,
                      outDir: 'dist/neutral',
                      outExtension: ({ format }) => (format === 'esm' ? { js: '.js' } : { js: '.cjs' }),
                      platform: 'neutral',
                      skipNodeModulesBundle: true,
                      target: 'esnext',
                      terserOptions: { format: { comments: false }, output: { comments: false } },
                      ...compile?.tsup?.options,
                      ...(typeof options === 'object' ? options : {}),
                    },
                    verbose,
                  ),
                ])
              ).reduce((prev, value) => prev + value, 0)
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0) ||
    (publint ? await packagePublint() : 0)
  )
}
