import yargs from 'yargs'
// eslint-disable-next-line import/no-internal-modules
import { hideBin } from 'yargs/helpers'

import { build } from '../actions'

const run = async () => {
  const options = await yargs(hideBin(process.argv))
    .option('verbose', {
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

  yargs(hideBin(process.argv))
    .command(
      'build [package]',
      'Package to build',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to build'
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Building: ${(argv.package ?? 'all')}`)
        build(options.target as ('esm' | 'cjs'))
      },
    )
    .parse()
  }

run()