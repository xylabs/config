import { getHeapStatistics } from 'v8'
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
      (argv) => {
        if (argv.verbose) console.info(`Building: ${argv.package ?? 'all'}`)
        if (argv.verbose) console.info(`Building-Heap: ${JSON.stringify(getHeapStatistics())}`)
        process.exitCode = build({ pkg: argv.package as string, target: argv.target as 'esm' | 'cjs' })
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
      (argv) => {
        if (argv.verbose) console.info(`Compiling: ${argv.package ?? 'all'}`)
        if (argv.verbose) console.info(`Compiling-Heap: ${JSON.stringify(getHeapStatistics())}`)
        process.exitCode = compile({ incremental: !!argv.incremental, pkg: argv.package as string, target: argv.target as 'esm' | 'cjs' })
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
        if (argv.verbose) console.info(`Rebuilding: ${argv.package ?? 'all'}`)
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
        if (argv.verbose) console.info(`Copying Assets: ${argv.package ?? 'all'}`)
        process.exitCode = await copyAssets({ target: argv.target as 'esm' | 'cjs' })
      },
    )
}
