import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import chalk from 'chalk'
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
  const input = await getInputs(subDir)
  const tsPlugIn = typescript({
    baseUrl: 'src',
    declaration: !subDir,
    declarationMap: !subDir,
    emitDeclarationOnly: false,
    esModuleInterop: true,
    exclude: ['**/*.spec.*', 'dist', 'docs', 'node_modules', 'packages'],
    outDir: subDir ? `dist/${subDir}` : 'dist',
    rootDir: 'src',
    tsconfig: 'tsconfig.json',
  })

  const errors: RollupLog[] = []
  const warnings: RollupLog[] = []
  const infos: RollupLog[] = []
  const debugs: RollupLog[] = []

  const options: RollupOptions = {
    input: input.map((file) => `./src/${file}`),
    logLevel: 'warn',
    onLog: (level, log, defaultHandler) => {
      switch (level) {
        case 'warn': {
          warnings.push(log)
          console.warn(chalk.yellow(JSON.stringify(log, null, 2)))
          break
        }
        case 'info': {
          infos.push(log)
          console.info(chalk.white(JSON.stringify(log, null, 2)))
          break
        }
        case 'debug': {
          debugs.push(log)
          console.debug(chalk.gray(JSON.stringify(log, null, 2)))
          break
        }
        default: {
          errors.push(log)
          console.error(chalk.red(JSON.stringify(log, null, 2)))
          break
        }
      }
      console.log(`Log: ${level}: ${log.cause}`)
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

const getInputDirs = async () => {
  return [
    undefined,
    ...(await readdir('src', { recursive: true, withFileTypes: true }))
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

const buildIt = async (pkg: PackageJsonEx) => {
  const inputDirs = await getInputDirs()

  const pkgType = pkg.type ?? 'commonjs'

  const esmExt = pkgType === 'module' ? 'js' : 'mjs'
  const cjsExt = pkgType === 'commonjs' ? 'js' : 'cjs'

  const rollupResult = await Promise.all(
    inputDirs.map(async (inputDir) => {
      return await rollItUp('esm', esmExt, inputDir) + await rollItUp('cjs', cjsExt, inputDir)
    }),
  )

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
  const pkgName = process.env.npm_package_name
  if (verbose) {
    console.log(chalk.green(`Compiling ${pkgName} Start`))
  }
  const result = (await buildIt(await loadPackageConfig())) + (publint ? await packagePublint() : 0)
  if (result) {
    const input = await getInputs()
    console.log(`Inputs: ${JSON.stringify(input, null, 2)}`)
    console.error(chalk.red(`Compiling ${pkgName} Failed [${result}]`))
  } else if (verbose) {
    console.log(chalk.green(`Compiling ${pkgName} Done`))
  }
  return result
}
