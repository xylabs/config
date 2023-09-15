import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import chalk from 'chalk'
import { copyFile, readdir } from 'fs/promises'
import { rollup } from 'rollup'
import externalDeps from 'rollup-plugin-exclude-dependencies-from-bundle'
import nodeExternals from 'rollup-plugin-node-externals'

import { loadPackageConfig, PackageJsonEx } from '../../loadPackageConfig'
import { packagePublint } from './publint'

export interface CompilePackageParams {
  publint?: boolean
  verbose?: boolean
}

const rollItUp = async (input: string[], format: 'cjs' | 'esm', ext: string) => {
  await (
    await rollup({
      input,
      logLevel: 'warn',
      perf: true,
      plugins: [
        commonjs(),
        externalDeps(),
        nodeExternals(),
        typescript({
          declaration: true,
          declarationMap: true,
          emitDeclarationOnly: false,
          esModuleInterop: true,
          exclude: ['**/*.spec.*', 'dist', 'docs'],
          outDir: 'dist',
          rootDir: 'src',
          tsconfig: 'tsconfig.json',
        }),
      ],
    })
  ).write({
    dir: 'dist',
    dynamicImportInCjs: true,
    entryFileNames: (chunkInfo) => `${chunkInfo.name}.${ext}`,
    format,
    sourcemap: true,
  })
}

const getInputs = async () => {
  return (await readdir('src', { recursive: true }))
    .filter((file) => (file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('d.ts') && !file.endsWith('spec.ts'))
    .map((file) => `src/${file}`)
}

const getDistTypeFiles = async () => {
  return (await readdir('dist', { recursive: true })).filter((file) => file.endsWith('d.ts')).map((file) => `dist/${file}`)
}

const getDistTypeMapFiles = async () => {
  return (await readdir('dist', { recursive: true })).filter((file) => file.endsWith('d.ts.map')).map((file) => `dist/${file}`)
}

const buildIt = async (pkg: PackageJsonEx) => {
  const input = await getInputs()

  const pkgType = pkg.type ?? 'commonjs'

  const esmExt = pkgType === 'module' ? 'js' : 'mjs'
  const cjsExt = pkgType === 'commonjs' ? 'js' : 'cjs'

  await rollItUp(input, 'esm', esmExt)
  await rollItUp(input, 'cjs', cjsExt)

  //hybrid packages want two copies of the types
  const distTypeFiles = await getDistTypeFiles()
  distTypeFiles.forEach(async (file) => {
    await copyFile(file, file.replace('d.ts', 'd.mts'))
  })

  const distTypeMapFiles = await getDistTypeMapFiles()
  distTypeMapFiles.forEach(async (file) => {
    await copyFile(file, file.replace('d.ts.map', 'd.mts.map'))
  })

  return 0
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
