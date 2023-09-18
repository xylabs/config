import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import chalk from 'chalk'
import { OutputOptions, rollup, RollupLog, RollupOptions } from 'rollup'
import externalDeps from 'rollup-plugin-exclude-dependencies-from-bundle'
import nodeExternals from 'rollup-plugin-node-externals'

import { loadConfig } from '../../../lib'
import { loadPackageConfig } from '../../../loadPackageConfig'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { getInputDirs, getInputs } from './inputs'

export interface PackageCompileRollupParams extends CompileParams {}

export const compileSubDir = async (format: 'cjs' | 'esm', ext: string, subDir?: string, _verbose = false) => {
  const dir = subDir === '.' ? undefined : subDir
  const input = await getInputs(dir)
  const tsPlugIn = typescript({
    baseUrl: 'src',
    declaration: !dir || !subDir,
    declarationMap: !dir || !subDir,
    emitDeclarationOnly: false,
    esModuleInterop: true,
    exclude: ['**/*.spec.*', 'dist', 'docs', 'node_modules', 'packages'],
    outDir: dir ? `dist/${dir}` : 'dist',
    rootDir: 'src',
    tsconfig: 'tsconfig.json',
  })

  const errors: RollupLog[] = []
  const warnings: RollupLog[] = []
  const infos: RollupLog[] = []
  const debugs: RollupLog[] = []

  const options: RollupOptions = {
    input: subDir ? input.map((file) => `./src/${file}`) : ['./src/index.ts'],
    logLevel: 'warn',
    onLog: (level, log, defaultHandler) => {
      const pushLog = !(log.code === 'EMPTY_BUNDLE' || log.code === 'MIXED_EXPORTS' || log.code === 'UNUSED_EXTERNAL_IMPORT')
      if (pushLog) {
        switch (level) {
          case 'warn': {
            warnings.push(log)
            break
          }
          case 'info': {
            infos.push(log)
            break
          }
          case 'debug': {
            debugs.push(log)
            break
          }
          default: {
            errors.push(log)
            break
          }
        }
      }
      console.log(chalk.yellow(`${level}: ${log.message} [${log.code}]`))
      if (log.id) {
        console.log(chalk.gray(log.id))
      }
      log.ids?.map((id) => {
        console.log(chalk.gray(id))
      })
      return defaultHandler(level, log)
    },
    plugins: [commonjs(), externalDeps(), nodeExternals(), json(), tsPlugIn],
  }

  const outputOptions: OutputOptions = {
    dir: subDir ? `dist/${subDir}` : 'dist',
    dynamicImportInCjs: true,
    entryFileNames: (chunkInfo) => `${chunkInfo.name}.${ext}`,
    format,
    sourcemap: true,
  }

  if (input.length) {
    await (await rollup(options)).write(outputOptions)
  }

  return errors.length + warnings.length
}

export const packageCompileRollup = async (params?: PackageCompileRollupParams) => {
  const config = await loadConfig(params)
  const pkg = await loadPackageConfig()
  const inputDirs = await getInputDirs(config.compile?.depth)
  const verbose = config.verbose
  const publint = config.compile?.publint

  const pkgType = pkg.type ?? 'commonjs'

  const esmExt = pkgType === 'module' ? 'js' : 'mjs'
  const cjsExt = pkgType === 'commonjs' ? 'js' : 'cjs'

  const result = (
    await Promise.all(
      inputDirs.map(async (inputDir) => {
        return (await compileSubDir('cjs', cjsExt, inputDir, verbose)) + (await compileSubDir('esm', esmExt, inputDir, verbose))
      }),
    )
  ).reduce((prev, result) => prev + result, 0)
  return result + (publint ? await packagePublint() : 0)
}
