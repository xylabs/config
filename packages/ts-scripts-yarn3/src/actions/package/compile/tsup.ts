import chalk from 'chalk'
import { build, defineConfig, Options } from 'tsup'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { getInputDirs, getInputs } from './inputs'
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

const compileSubDir = async (subDir?: string, options?: Options, verbose?: boolean) => {
  const dir = subDir === '.' ? undefined : subDir
  const input = await getInputs(dir)
  const optionsResult = defineConfig({
    bundle: true,
    cjsInterop: true,
    clean: true,
    /*dts: {
      compilerOptions: {
        skipDefaultLibCheck: true,
        skipLibCheck: true,
      },
      entry: input.map((entry) => `src/${entry}`),
      only: false,
      resolve: false,
    },*/
    entry: subDir ? input.map((file) => `./src/${file}`) : ['./src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: subDir ? `dist/${subDir}` : 'dist',
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

  return await packageCompileTscTypes({ verbose })
}

export const packageCompileTsup = async (params?: PackageCompileTsupParams) => {
  const config = await loadConfig(params)
  const publint = config.compile?.publint ?? true
  if (config.verbose) {
    console.log(`Compiling with TSUP [Depth: ${config.compile?.depth}]`)
  }
  const inputDirs = await getInputDirs(config.compile?.depth)

  if (inputDirs.length) {
    const result = (
      await Promise.all(
        inputDirs.map(async (inputDir) => {
          return await compileSubDir(inputDir, config.compile?.tsup?.options, config.verbose)
        }),
      )
    ).reduce((prev, result) => prev + result, 0)
    return result + (publint ? await packagePublint() : 0)
  } else {
    const result = await compileSubDir(undefined, config.compile?.tsup?.options, config.verbose)
    return result + (publint ? await packagePublint() : 0)
  }
}
