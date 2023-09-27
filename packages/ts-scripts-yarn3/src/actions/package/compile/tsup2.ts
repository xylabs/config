import { build, defineConfig, Options } from 'tsup'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { getAllInputs2 } from './inputs'
import { packageCompileTscNoEmit } from './tscNoEmit'
import { packageCompileTscTypes } from './tscTypes'

export type PackageCompileTsup2Params = Partial<
  CompileParams & {
    compile?: {
      browser?: Record<string, Options | boolean>
      node?: Record<string, Options | boolean>
      tsup?: {
        options?: Options
      }
    }
  }
>

const compileFolder = async (folder: string, options?: Options, _verbose?: boolean) => {
  const outDir = options?.outDir ?? 'dist'
  const entry = getAllInputs2(folder).filter((entry) => !entry.includes('.spec.') && !entry.includes('.story.'))
  const optionsResult = defineConfig({
    bundle: true,
    cjsInterop: true,
    clean: true,
    dts: false,
    entry,
    format: ['cjs', 'esm'],
    loader: { '.gif': 'copy', '.jpg': 'copy', '.json': 'copy', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' },
    outDir,
    silent: true,
    sourcemap: true,
    splitting: false,
    tsconfig: 'tsconfig.json',
    ...options,
  })
  const optionsList = (
    await Promise.all(
      (Array.isArray(optionsResult) ? optionsResult : [optionsResult])
        .map<Promise<Options[]>>(async (options) => {
          const result = typeof options === 'function' ? await options({}) : [options]
          return Array.isArray(result) ? result : [result]
        })
        .flat(),
    )
  ).flat()
  await Promise.all(optionsList.map((options) => build(options)))

  return 0
}

export const packageCompileTsup2 = async (params?: PackageCompileTsup2Params) => {
  const { verbose, compile } = await loadConfig(params)
  const publint = compile?.publint ?? true
  if (verbose) {
    console.log(`Compiling with TSUP [Depth: ${compile?.depth}]`)
  }

  const compileForNode = compile?.node ?? { src: {} }
  const compileForBrowser = compile?.browser ?? { src: {} }

  return (
    packageCompileTscNoEmit({ verbose }) ||
    (
      await Promise.all(
        Object.entries(compileForNode).map(async ([folder, options]) => {
          return folder
            ? await compileFolder(
                folder,
                { ...(compile?.tsup?.options ?? {}), outDir: 'dist/node', platform: 'node', ...(typeof options === 'object' ? options : {}) },
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0) ||
    (
      await Promise.all(
        Object.entries(compileForBrowser).map(async ([folder, options]) => {
          return folder
            ? await compileFolder(
                folder,
                {
                  ...(compile?.tsup?.options ?? {}),
                  bundle: false,
                  format: ['esm', 'cjs'],
                  outDir: 'dist/browser',
                  outExtension: ({ format }) => (format === 'esm' ? { js: '.js' } : { js: '.cjs' }),
                  platform: 'browser',
                  ...(typeof options === 'object' ? options : {}),
                },
                verbose,
              )
            : 0
        }),
      )
    ).reduce((prev, value) => prev + value, 0) ||
    (compileForNode ? await packageCompileTscTypes({ verbose }, { outDir: 'dist/node' }) : 0) ||
    (compileForBrowser ? await packageCompileTscTypes({ verbose }, { outDir: 'dist/browser' }) : 0) ||
    (publint ? await packagePublint() : 0)
  )
}
