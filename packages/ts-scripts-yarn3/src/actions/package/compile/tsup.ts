import { build, defineConfig, Options } from 'tsup'
import {getInputDirs, getInputs} from './inputs'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { loadConfig } from '../../../lib'
import { packageCompileTscTypes } from './tscTypes'

export type PackageCompileTsupParams = Partial<CompileParams & {
  compile?: {
    tsup?: {
      options?: Options
    }
  }
}>

const compileSubDir = async (subDir?: string, options?: Options, verbose?: boolean) => {
  const dir = subDir === '.' ? undefined : subDir
  const input = await getInputs(dir)
  const optionsResult = defineConfig({
    bundle: true,
    cjsInterop: true,
    clean: true,
    dts: {
      entry: ['src/index.ts'],
      resolve: false,
      only: false
    },
    entry: subDir ? input.map((file) => `./src/${file}`) : ['./src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    sourcemap: true,
    splitting: false,
    tsconfig: 'tsconfig.json',
    ...options
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

  return await packageCompileTscTypes({verbose})
}

export const packageCompileTsup = async (params?: PackageCompileTsupParams) => {
  const config = await loadConfig(params)
  if (config.verbose) {
    console.log(`Compiling with TSUP`)
  }
  const inputDirs = await getInputDirs(config.compile?.depth)

  const result = (await Promise.all(
    inputDirs.map(async (inputDir) => {
      return await compileSubDir(inputDir, config.compile?.tsup?.options, config.verbose )
    }),
  )).reduce(((prev, result) => prev + result), 0)
  return result + (config.compile?.publint ? await packagePublint() : 0)
}