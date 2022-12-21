import yargs from 'yargs'

import { clean, reinstall, up, updo } from '../../actions'

export const xyInstallCommands = (args: yargs.Argv) => {
  return args
    .command(
      'clean [package]',
      'Clean - Remove intermediate files',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to clean',
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Cleaning: ${argv.package ?? 'all'}`)
        process.exitCode = clean()
      },
    )
    .command(
      'reinstall',
      'Reinstall - Clean & Install',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Reinstalling')
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
        if (argv.verbose) console.info('Up')
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
        if (argv.verbose) console.info('Updo')
        process.exitCode = updo()
      },
    )
}