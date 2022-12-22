import yargs from 'yargs'

import {
  dead,
  deps,
  genDocs,
  gitlint,
  gitlintFix,
  license,
  runRimraf,
  test,
  tsconfigGen,
  tsconfigGenClean,
  updateYarnPlugins,
  yarn3Only,
} from '../../actions'
import { updateYarnVersion } from '../../actions/upyarn'

export const xyCommonCommands = (args: yargs.Argv) => {
  return args

    .command(
      'license [package]',
      'License - Check licenses of dependencies',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`License: ${argv.package ?? 'all'}`)
        process.exitCode = license()
      },
    )
    .command(
      'dead [package]',
      'Dead - Check for dead code',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('Dead')
        process.exitCode = dead()
      },
    )
    .command(
      'deps [package]',
      'Deps - Check for unused or missing dependencies',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Checking Dependencies: ${argv.package ?? 'all'}`)
        process.exitCode = deps({ incremental: !!argv.incremental, pkg: argv.package as string })
      },
    )
    .command(
      'gen-docs [package]',
      'GenDocs - Generate TypeDocs',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to generate docs for',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('GenDocs')
        process.exitCode = genDocs()
      },
    )
    .command(
      'gitlint [package]',
      'Gitlint - Lint your git config',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Gitlint')
        process.exitCode = argv.fix ? gitlintFix() : gitlint()
      },
    )
    .command(
      'test',
      'Test - Run Jest Tests',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Testing')
        process.exitCode = test()
      },
    )
    .command(
      'tsconfig-gen [package]',
      'Tsconfig Gen - Generate tsconfig.json file for building',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package for generation',
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`TsconfigGen: ${argv.package ?? 'all'}`)
        process.exitCode = tsconfigGen({ target: argv.target as 'esm' | 'cjs' })
      },
    )
    .command(
      'tsconfig-clean',
      'Tsconfig Clean - Remove generated tsconfig.json files',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Tsconfig Clean')
        process.exitCode = tsconfigGenClean()
      },
    )
    .command(
      'upplug',
      'UpPlug - Update Yarn Plugins',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('UpPlug')
        process.exitCode = updateYarnPlugins()
      },
    )
    .command(
      'upyarn',
      'UpYarn - Update Yarn Version',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('UpYarn')
        process.exitCode = updateYarnVersion()
      },
    )
    .command(
      'rimraf',
      'Run rimraf',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Rimraf')
        process.exitCode = runRimraf()
      },
    )
    .command(
      'yarn3only',
      'Yarn3Only - Check if using Yarn v3',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Yarn 3 Check')
        process.exitCode = yarn3Only()
      },
    )
}
