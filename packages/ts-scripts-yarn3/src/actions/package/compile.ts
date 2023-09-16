import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import chalk from 'chalk'
import { cosmiconfig } from 'cosmiconfig'
import { copyFile, readdir } from 'fs/promises'
import { OutputOptions, rollup, RollupLog, RollupOptions, watch } from 'rollup'
import externalDeps from 'rollup-plugin-exclude-dependencies-from-bundle'
import nodeExternals from 'rollup-plugin-node-externals'

import { loadPackageConfig, PackageJsonEx } from '../../loadPackageConfig'
import { packagePublint } from './publint'

export interface CompilePackageParams {
  publint?: boolean
  verbose?: boolean
}

const rollItUp = async (format: 'cjs' | 'esm', ext: string, subDir?: string) => {
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
      const pushLog = !(log.code === 'EMPTY_BUNDLE' || log.code === 'MIXED_EXPORTS')
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
    plugins: [commonjs(), externalDeps(), nodeExternals(), tsPlugIn],
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

const getInputs = async (subDir?: string) => {
  return (await readdir(subDir ? `src/${subDir}` : 'src', { recursive: false }))
    .filter((file) => (file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('d.ts') && !file.endsWith('spec.ts'))
    .map((file) => (subDir ? `${subDir}/${file}` : file))
}

const getInputDirs = async (depth: number) => {
  if (depth === 0) {
    return []
  }
  return [
    '.',
    ...(await readdir('src', { recursive: depth > 1, withFileTypes: true }))
      .filter((file) => file.isDirectory())
      .map((file) => {
        const pathParts = file.path.split('/')
        pathParts.shift()
        if (pathParts.length) {
          const root = pathParts.join('/')
          return `${root}/${file.name}`
        } else {
          return file.name
        }
      }),
  ]
}

const getDistTypeFiles = async () => {
  return (await readdir('dist', { recursive: true })).filter((file) => file.endsWith('d.ts')).map((file) => `dist/${file}`)
}

const getDistTypeMapFiles = async () => {
  return (await readdir('dist', { recursive: true })).filter((file) => file.endsWith('d.ts.map')).map((file) => `dist/${file}`)
}

const buildIt = async (pkg: PackageJsonEx, compileDepth: number) => {
  console.log(`Compile Depth: ${compileDepth}`)
  const inputDirs = await getInputDirs(compileDepth)

  const pkgType = pkg.type ?? 'commonjs'

  const esmExt = pkgType === 'module' ? 'js' : 'mjs'
  const cjsExt = pkgType === 'commonjs' ? 'js' : 'cjs'

  const rollupResult = inputDirs.length
    ? await Promise.all(
        inputDirs.map(async (inputDir) => {
          return (await rollItUp('esm', esmExt, inputDir)) + (await rollItUp('cjs', cjsExt, inputDir))
        }),
      )
    : [(await rollItUp('esm', esmExt)) + (await rollItUp('cjs', cjsExt))]

  //hybrid packages want two copies of the types
  const distTypeFiles = await getDistTypeFiles()
  await Promise.all(
    distTypeFiles.map(async (file) => {
      await copyFile(file, file.replace('d.ts', 'd.mts'))
    }),
  )

  const distTypeMapFiles = await getDistTypeMapFiles()
  await Promise.all(
    distTypeMapFiles.map(async (file) => {
      await copyFile(file, file.replace('d.ts.map', 'd.mts.map'))
    }),
  )

  return rollupResult.reduce((prev, item) => prev + item, 0)
}

export const packageCompile = async ({ publint = true, verbose }: CompilePackageParams = { verbose: false }) => {
  const xyConfig = await cosmiconfig('xy').search()
  const compileDepth: number = xyConfig?.config.compile?.depth ?? 0
  const pkgName = process.env.npm_package_name
  if (verbose) {
    console.log(chalk.green(`Compiling ${pkgName} Start`))
  }
  const result = (await buildIt(await loadPackageConfig(), compileDepth)) + (publint ? await packagePublint() : 0)
  if (result) {
    const input = await getInputs()
    console.log(`Inputs: ${JSON.stringify(input, null, 2)}`)
    console.error(chalk.red(`Compiling ${pkgName} Failed [${result}]`))
  } else if (verbose) {
    console.log(chalk.green(`Compiling ${pkgName} Done`))
  }
  return result
}
