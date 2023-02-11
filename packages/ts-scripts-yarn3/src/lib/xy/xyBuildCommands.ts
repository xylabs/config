import yargs from 'yargs'

import { build, compile, copyAssets, rebuild } from '../../actions'

export const xyBuildCommands = (args: yargs.Argv) => {
  return args
    .command(
      'build [package]',
      'Build - Compile & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to build',
        })
      },
      async (argv) => {
        if (argv.verbose) {
          console.log(`Building: ${argv.package ?? 'all'}`)
        }

        process.exitCode = await build({
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
        return yargs.positional('package', {
          describe: 'Specific package to compile',
        })
      },
      async (argv) => {
        if (argv.verbose) {
          console.log(`Compiling: ${argv.package ?? 'all'}`)
        }
        process.exitCode = await compile({
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
        return yargs.positional('package', {
          describe: 'Specific package to rebuild',
        })
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
        return yargs.positional('package', {
          describe: 'Specific package to copy assets',
        })
      },
      async (argv) => {
        if (argv.verbose) console.log(`Copying Assets: ${argv.package ?? 'all'}`)
        process.exitCode = await copyAssets({ target: argv.target as 'esm' | 'cjs' })
      },
    )
}
