import yargs from 'yargs'

import {
  dead,
  deps,
  genDocs,
  gitlint,
  gitlintFix,
  license,
  test,
  tsconfigGen,
  tsconfigGenClean,
  updateYarnPlugins,
  updateYarnVersion,
  yarn3Only,
} from '../../actions'

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
      async (argv) => {
        if (argv.verbose) console.log(`License: ${argv.package ?? 'all'}`)
        process.exitCode = await license()
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
        if (argv.verbose) console.log('Dead')
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
        if (argv.verbose) console.log(`Checking Dependencies: ${argv.package ?? 'all'}`)
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
        if (argv.verbose) console.log(`Generating TypeDocs: ${argv.package ?? 'all'}`)
        process.exitCode = genDocs({ incremental: !!argv.incremental, pkg: argv.package as string })
      },
    )
    .command(
      'gitlint [package]',
      'Gitlint - Lint your git config',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Gitlint')
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
        if (argv.verbose) console.log('Testing')
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
        if (argv.verbose) console.log(`TsconfigGen: ${argv.package ?? 'all'}`)
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
        if (argv.verbose) console.log('Tsconfig Clean')
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
        if (argv.verbose) console.log('UpPlug')
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
        if (argv.verbose) console.log('UpYarn')
        process.exitCode = updateYarnVersion()
      },
    )
    .command(
      'yarn3only',
      'Yarn3Only - Check if using Yarn v3',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Yarn 3 Check')
        process.exitCode = yarn3Only()
      },
    )
}
