import { compile, copyAssets, rebuild } from '@xylabs/ts-scripts-yarn3'
import yargs from 'yargs'

import { build, buildci } from '../actions'

export const xyReactBuildCommands = (args: yargs.Argv) => {
  return args
    .command(
      'build',
      'Build - Build React project',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Building')
        process.exitCode = build()
      },
    )
    .command(
      'build-ci',
      'Build CI - Build React project for continuous integration',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Building CI')
        process.exitCode = buildci()
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
        process.exitCode = compile({ target: argv.target as 'esm' | 'cjs' })
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
}
