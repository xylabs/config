import { build, defineConfig, Options } from 'tsup'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { getAllInputs } from './inputs'
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
  const outDir = options?.outDir ?? 'dist'
  const entry = (await getAllInputs()).filter((entry) => !entry.includes('.spec.') && !entry.includes('.story.')).map((entry) => `src/${entry}`)
  const optionsResult = defineConfig({
    bundle: false,
    cjsInterop: true,
    clean: true,
    dts: false,
    entry,
    format: ['cjs', 'esm'],
    loader: { '.gif': 'copy', '.jpg': 'copy', '.png': 'copy', '.svg': 'copy', '.webp': 'copy' },
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

  return (
    packageCompileTscNoEmit({ verbose }) ||
    (await compileFolder({ ...(compile?.tsup?.options ?? {}), outDir: 'dist/node', platform: 'node' }, verbose)) ||
    (await compileFolder(
      {
        ...(compile?.tsup?.options ?? {}),
        format: ['esm'],
        outDir: 'dist/browser',
        outExtension: ({ format }) => (format === 'esm' ? { js: '.js' } : { js: '.cjs' }),
        platform: 'browser',
      },
      verbose,
    )) ||
    (await packageCompileTscTypes({ verbose }, { outDir: 'dist/node' })) ||
    (await packageCompileTscTypes({ verbose }, { outDir: 'dist/browser' })) ||
    (publint ? await packagePublint() : 0)
  )
}
