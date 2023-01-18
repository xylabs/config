import yargs from 'yargs'

import { cycle, fix, lint, lintProfile, relint, sonar } from '../../actions'

export const xyLintCommands = (args: yargs.Argv) => {
  return args
    .command(
      'cycle [package]',
      'Cycle - Check for dependency cycles',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('Cycle')
        process.exitCode = cycle()
      },
    )
    .command(
      'lint [package]',
      'Lint - Run Eslint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('Lint')
        process.exitCode = argv.fix ? fix() : argv.profile ? lintProfile() : lint()
      },
    )
    .command(
      'fix [package]',
      'Fix - Run Eslint w/fix',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('Fix')
        process.exitCode = fix()
      },
    )
    .command(
      'relint [package]',
      'Relint - Clean & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to relint',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('Relinting')
        process.exitCode = relint()
      },
    )
    .command(
      'sonar',
      'Sonar - Run Sonar Check',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Sonar Check')
        process.exitCode = sonar()
      },
    )
}
