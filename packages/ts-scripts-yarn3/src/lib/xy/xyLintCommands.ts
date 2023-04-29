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
        if (argv.verbose) console.log('Cycle')
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
      async (argv) => {
        if (argv.verbose) console.log('Lint')
        process.exitCode = argv.fix ? fix() : argv.profile ? lintProfile() : await lint({ pkg: argv.package as string })
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
        if (argv.verbose) console.log('Fix')
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
        if (argv.verbose) console.log('Relinting')
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
        if (argv.verbose) console.log('Sonar Check')
        process.exitCode = sonar()
      },
    )
}
