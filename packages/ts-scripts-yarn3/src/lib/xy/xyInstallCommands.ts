import yargs from 'yargs'

import { checkAllDependenciesForDuplicates, clean, confirmStaticDependencies, reinstall, up, updo } from '../../actions'

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
        if (argv.verbose) console.log(`Cleaning: ${argv.package ?? 'all'}`)
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
        process.exitCode = confirmStaticDependencies()
      },
    )
    .command(
      'statics-all',
      'Statics [All] - All Dependencies',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Statics')
        process.exitCode = checkAllDependenciesForDuplicates()
      },
    )
}
