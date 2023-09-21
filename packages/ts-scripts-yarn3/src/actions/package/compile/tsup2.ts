import { build, defineConfig, Options } from 'tsup'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { packageCompileTscNoEmit } from './tscNoEmit'
import { packageCompileTscTypes } from './tscTypes'

export type PackageCompileTsup2Params = Partial<
  CompileParams & {
    compile?: {
      tsup?: {
        options?: Options
      }
    }
  }
>

const compileFolder = async (options?: Options, _verbose?: boolean) => {
  const optionsResult = defineConfig({
    bundle: false,
    cjsInterop: true,
    clean: true,
    dts: false,
    entry: ['src'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
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

  return (
    packageCompileTscNoEmit({ verbose }) ||
    (await compileFolder({ ...(compile?.tsup?.options ?? {}), outDir: 'dist/node', platform: 'node' }, verbose)) ||
    (await compileFolder({ ...(compile?.tsup?.options ?? {}), outExtension: () => ({js: '.js'}), outDir: 'dist/browser', platform: 'browser' }, verbose)) ||
    (await packageCompileTscTypes({ verbose}, { outDir: 'dist/browser' })) ||
    (await packageCompileTscTypes({ verbose }, { outDir: 'dist/node' })) ||
    (publint ? await packagePublint() : 0)
  )
}