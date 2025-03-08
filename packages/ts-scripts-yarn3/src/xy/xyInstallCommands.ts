import type { Argv } from 'yargs'

import {
  clean, dupdeps, reinstall, statics, up, updo,
} from '../actions/index.ts'

export const xyInstallCommands = (args: Argv) => {
  return args
    .command(
      'clean [package]',
      'Clean',
      (yargs) => {
        return yargs.positional('package', { describe: 'Specific package to clean' })
      },
      async (argv) => {
        if (argv.verbose) {
          console.log(`Cleaning: ${argv.package ?? 'all'}`)
        }
        process.exitCode = await clean({
          pkg: argv.package as string,
          verbose: !!argv.verbose,
        })
      },
    )
    .command(
      'reinstall',
      'Reinstall - Clean & Install',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Reinstalling')
        process.exitCode = reinstall()
      },
    )
    .command(
      'up',
      'Up - Update dependencies',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Up')
        process.exitCode = up()
      },
    )
    .command(
      'updo',
      'Updo - Update dependencies [Interactive]',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Updo')
        process.exitCode = updo()
      },
    )
    .command(
      'statics',
      'Statics - Confirming Static Packages',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Statics')
        process.exitCode = statics()
      },
    )
    .command(
      'dupdeps',
      'Dupdeps - Duplicate Dependencies in package.json',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Dupdeps')
        process.exitCode = dupdeps()
      },
    )
}
