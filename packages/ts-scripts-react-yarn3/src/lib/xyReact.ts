#!/usr/bin/env node

import {
  cycle,
  dead,
  deps,
  fix,
  genDocs,
  gitlint,
  gitlintFix,
  license,
  lint,
  lintFast,
  lintProfile,
  xyParseOptions,
  reinstall,
  relint,
  runRimraf,
  sonar,
  tsconfigGen,
  tsconfigGenClean,
  up,
  updateYarnPlugins,
  updo,
  xyInstallCommands,
  yarn3Only,
} from '@xylabs/ts-scripts-yarn3'

import { analyze, clean, eject, sitemap, start, test } from '../actions'
import { xyReactBuildCommands } from './xyReactBuildCommands'

export const xyReact = () => {
  return xyReactBuildCommands(xyInstallCommands(xyParseOptions()))
    .command(
      'analyze',
      'Analyze - Analyze Bundles',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Analyzing')
        process.exitCode = analyze()
      },
    )
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
      'lint [package]',
      'Lint - Run Eslint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('Lint')
        process.exitCode = argv.fix ? fix() : argv.profile ? lintProfile() : argv.cache ? lintFast() : lint()
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
      'deps [package]',
      'Deps - Check for unused or missing dependencies',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to check',
        })
      },
      (argv) => {
        if (argv.verbose) console.info('Deps')
        process.exitCode = deps()
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
    .command(
      'test',
      'Test - Run all unit tests',
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
      'Tsconfig Gen - Generate tsconfog.json file for building',
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
      'Upplug - Update Yarn Plugins',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Upplug')
        process.exitCode = updateYarnPlugins()
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
    .command(
      'eject',
      'Eject - Eject React project',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Ejecting')
        process.exitCode = eject()
      },
    )
    .command(
      'sitemap',
      'Sitemap - Generate sitemap for the project',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Generating Sitemap')
        process.exitCode = sitemap()
      },
    )
    .command(
      'start',
      'Start - Start project in browser',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Starting')
        process.exitCode = start()
      },
    )
    .help().argv
}
