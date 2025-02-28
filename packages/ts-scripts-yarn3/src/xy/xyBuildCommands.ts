import { Argv } from 'yargs'

import {
  build, compile, copyAssets, rebuild, recompile,
} from '../actions/index.ts'

export const xyBuildCommands = (args: Argv) => {
  return args
    .command(
      'build [package]',
      'Build - Compile & Lint',
      (yargs) => {
        return yargs.positional('package', { describe: 'Specific package to build' })
      },
      async (argv) => {
        if (argv.verbose) {
          console.log(`Building: ${argv.package ?? 'all'}`)
        }

        process.exitCode = await build({
          incremental: !!argv.incremental,
          jobs: argv.jobs as number,
          pkg: argv.package as string,
          target: argv.target as 'esm' | 'cjs',
          verbose: !!argv.verbose,
        })
      },
    )
    .command(
      'compile [package]',
      'Compile with Typescript & Copy Images',
      (yargs) => {
        return yargs.positional('package', { describe: 'Specific package to compile' })
      },
      (argv) => {
        if (argv.verbose) {
          console.log(`Compiling: ${argv.package ?? 'all'}`)
        }
        process.exitCode = compile({
          incremental: !!argv.incremental,
          jobs: argv.jobs as number,
          pkg: argv.package as string,
          target: argv.target as 'esm' | 'cjs',
          types: argv.types as 'tsc' | 'tsup',
          verbose: !!argv.verbose,
        })
      },
    )
    .command(
      'compile-only [package]',
      'Compile with Typescript & Copy Images (No Publint)',
      (yargs) => {
        return yargs.positional('package', { describe: 'Specific package to compile' })
      },
      (argv) => {
        if (argv.verbose) {
          console.log(`Compiling: ${argv.package ?? 'all'}`)
        }
        process.exitCode = compile({
          incremental: !!argv.incremental,
          jobs: argv.jobs as number,
          pkg: argv.package as string,
          publint: false,
          target: argv.target as 'esm' | 'cjs',
          verbose: !!argv.verbose,
        })
      },
    )
    .command(
      'recompile [package]',
      'Re-compile with Typescript & Copy Images',
      (yargs) => {
        return yargs.positional('package', { describe: 'Specific package to re-compile' })
      },
      async (argv) => {
        if (argv.verbose) {
          console.log(`Re-compiling: ${argv.package ?? 'all'}`)
        }
        process.exitCode = await recompile({
          incremental: !!argv.incremental,
          jobs: argv.jobs as number,
          pkg: argv.package as string,
          target: argv.target as 'esm' | 'cjs',
          verbose: !!argv.verbose,
        })
      },
    )
    .command(
      'rebuild [package]',
      'Rebuild - Clean, Compile & Lint',
      (yargs) => {
        return yargs.positional('package', { describe: 'Specific package to rebuild' })
      },
      (argv) => {
        if (argv.verbose) console.log(`Rebuilding: ${argv.package ?? 'all'}`)
        process.exitCode = rebuild({ target: argv.target as 'esm' | 'cjs' })
      },
    )
    .command(
      'copy-assets [package]',
      'Copy Assets - Copy the assets from src to dist',
      (yargs) => {
        return yargs.positional('package', { describe: 'Specific package to copy assets' })
      },
      async (argv) => {
        if (argv.verbose) console.log(`Copying Assets: ${argv.package ?? 'all'}`)
        process.exitCode = await copyAssets({ target: argv.target as 'esm' | 'cjs' })
      },
    )
}
