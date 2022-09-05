import yargs from 'yargs'
// eslint-disable-next-line import/no-internal-modules
import { hideBin } from 'yargs/helpers'

import { build, compile, clean, copyAssets } from '../actions'

const parseOptions = async (y: typeof yargs) => {
  return await y.option('verbose', {
    alias: 'v',
    description: 'Run with verbose logging',
    type: 'boolean',
  })
  .option('target', {
    alias: 't',
    description: 'Limit output to specific target',
    type: 'string',
    choices: ['esm', 'cjs']
  })
  .parse()
}

const run = async () => {
  const y = yargs(hideBin(process.argv))
  const options = await parseOptions(y)

  y.command(
      'build [package]',
      'Build - Compile & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to build'
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Building: ${(argv.package ?? 'all')}`)
        build({target: options.target as ('esm' | 'cjs')})
      },
    )
    .command(
      'compile [package]',
      'Compile with Typescript & Copy Images',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to compile'
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Compiling: ${(argv.package ?? 'all')}`)
        compile({target: options.target as ('esm' | 'cjs')})
      },
    )
    .command(
      'clean [package]',
      'Clean - Remove intermediate files',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to clean'
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Cleaning: ${(argv.package ?? 'all')}`)
        clean()
      },
    )
    .command(
      'copy-assets [package]',
      'Copy Assets - Copy the assets from src to dist',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to copy assets'
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Copying Assets: ${(argv.package ?? 'all')}`)
        copyAssets({target: options.target as ('esm' | 'cjs')})
      },
    )
    .parse()
  }

run()