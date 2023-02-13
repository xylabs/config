import { compile, copyAssets } from '@xylabs/ts-scripts-yarn3'
import yargs from 'yargs'

import { build, buildci, rebuild } from '../actions'

export const xyReactBuildCommands = (args: yargs.Argv) => {
  return args
    .command(
      'build',
      'Build - Build React project && Packages',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Building')
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
        if (argv.verbose) console.log('Building CI')
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
      async (argv) => {
        if (argv.verbose) console.log(`Compiling: ${argv.package ?? 'all'}`)
        process.exitCode = await compile({ target: argv.target as 'esm' | 'cjs' })
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
    .command(
      'rebuild',
      'Rebuild - Clean, Compile & Lint',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Rebuilding')
        process.exitCode = rebuild()
      },
    )
}
