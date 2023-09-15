import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import chalk from 'chalk'
import { copyFile } from 'fs/promises'
import { rollup } from 'rollup'
import externalDeps from 'rollup-plugin-exclude-dependencies-from-bundle'
import nodeExternals from 'rollup-plugin-node-externals'

export interface CompilePackageParams {
  verbose?: boolean
}

const buildIt = async () => {
  await (
    await rollup({
      input: 'src/index.ts',
      logLevel: 'debug',
      perf: true,
      plugins: [
        commonjs(),
        externalDeps(),
        nodeExternals(),
        typescript({
          declaration: true,
          declarationMap: true,
          emitDeclarationOnly: false,
          exclude: ['**/*.spec.*', 'dist', 'docs'],
          outDir: 'dist',
          rootDir: 'src',
          tsconfig: 'tsconfig.json',
        }),
      ],
    })
  ).write({
    dir: 'dist',
    entryFileNames: (chunkInfo) => `${chunkInfo.name}.mjs`,
    format: 'esm',
    sourcemap: true,
  })

  await (
    await rollup({
      input: 'src/index.ts',
      logLevel: 'warn',
      perf: true,
      plugins: [
        externalDeps(),
        nodeExternals(),
        typescript({
          declaration: true,
          declarationMap: true,
          emitDeclarationOnly: false,
          exclude: ['**/*.spec.*', 'dist', 'docs'],
          outDir: 'dist',
          rootDir: 'src',
          tsconfig: 'tsconfig.json',
        }),
      ],
    })
  ).write({
    dir: 'dist',
    entryFileNames: (chunkInfo) => `${chunkInfo.name}.js`,
    format: 'cjs',
    sourcemap: true,
  })
  await copyFile('./dist/index.d.ts', './dist/index.d.mts')
  await copyFile('./dist/index.d.ts.map', './dist/index.d.mts.map')

  return 0
}

export const packageCompile = async ({ verbose }: CompilePackageParams = {verbose: false}) => {
  if (verbose) {
    const pkgName = process.env.npm_package_name
    console.log(chalk.green(`Compiling ${pkgName}`))
  }
  return await buildIt()
}
