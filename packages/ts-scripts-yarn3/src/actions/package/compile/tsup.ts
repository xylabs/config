import { build, defineConfig, Options } from 'tsup'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { getInputDirs, getInputs } from './inputs'
import { packageCompileTscNoEmit } from './tscNoEmit'
import { packageCompileTscTypes } from './tscTypes'

export type PackageCompileTsupParams = Partial<
  CompileParams & {
    compile?: {
      tsup?: {
        options?: Options
      }
    }
  }
>

const compileSubDir = async (subDir?: string, options?: Options, _verbose?: boolean) => {
  const dir = subDir === '.' ? undefined : subDir
  const input = await getInputs(dir)
  if (input.length === 0) {
    return 0
  }
  const optionsResult = defineConfig({
    bundle: false,
    cjsInterop: true,
    clean: true,
    dts: false,
    entry: subDir ? input.map((file) => `./src/${file}`) : ['./src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: subDir ? `dist/${subDir}` : 'dist',
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

export const packageCompileTsup = async (params?: PackageCompileTsupParams) => {
  const { verbose, compile } = await loadConfig(params)
  const publint = compile?.publint ?? true
  if (verbose) {
    console.log(`Compiling with TSUP [Depth: ${compile?.depth}]`)
  }
  const inputDirs = await getInputDirs(compile?.depth)

  const noEmitResult = await packageCompileTscNoEmit({ verbose })

  if (noEmitResult) {
    return noEmitResult
  }

  if (inputDirs.length) {
    const result = (
      await Promise.all(
        inputDirs.map(async (inputDir) => {
          return await compileSubDir(inputDir, compile?.tsup?.options, verbose)
        }),
      )
    ).reduce((prev, result) => prev + result, 0)
    return result || (await packageCompileTscTypes({ verbose })) || (publint ? await packagePublint() : 0)
  } else {
    return (
      packageCompileTscNoEmit({ verbose }) ||
      (await compileSubDir(undefined, compile?.tsup?.options, verbose)) ||
      (await packageCompileTscTypes({ verbose })) ||
      (publint ? await packagePublint() : 0)
    )
  }
}
