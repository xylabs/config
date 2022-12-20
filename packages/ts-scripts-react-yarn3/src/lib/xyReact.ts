#!/usr/bin/env node

import {
  compile,
  copyAssets,
  cycle,
  dead,
  deploy,
  deployMajor,
  deployMinor,
  deployNext,
  deps,
  fix,
  genDocs,
  gitlint,
  gitlintFix,
  license,
  lint,
  lintFast,
  lintProfile,
  parseOptions,
  rebuild,
  reinstall,
  relint,
  sonar,
  tsconfigGen,
  tsconfigGenClean,
  up,
  updo,
  yarn3Only,
} from '@xylabs/ts-scripts-yarn3'

import { analyze, build, buildci, clean, eject, sitemap, start, test } from '../actions'

export const xyReact = () => {
  return parseOptions()
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
      'build',
      'Build - Build React project',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Building')
        process.exitCode = build()
      },
    )
    .command(
      'build-ci',
      'Build CI - Build React project for continuous integration',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Building CI')
        process.exitCode = buildci()
      },
    )
    .command(
      'compile [package]',
      'Compile with Typescript & Copy Images',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to compile',
        })
      },
      async (argv) => {
        if (argv.verbose) console.info(`Compiling: ${argv.package ?? 'all'}`)
        process.exitCode = await compile({ target: argv.target as 'esm' | 'cjs' })
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
      'copy-assets [package]',
      'Copy Assets - Copy the assets from src to dist',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to copy assets',
        })
      },
      async (argv) => {
        if (argv.verbose) console.info(`Copying Assets: ${argv.package ?? 'all'}`)
        process.exitCode = await copyAssets({ target: argv.target as 'esm' | 'cjs' })
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
      'deploy',
      'Deploy - Deploy patch',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy patch')
        process.exitCode = deploy()
      },
    )
    .command(
      'deploy-minor',
      'Deploy - Deploy minor',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy minor')
        process.exitCode = deployMinor()
      },
    )
    .command(
      'deploy-major',
      'Deploy - Deploy major',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy major')
        process.exitCode = deployMajor()
      },
    )
    .command(
      'deploy-next',
      'Deploy - Deploy next',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy next')
        process.exitCode = deployNext()
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
      'rebuild [package]',
      'Rebuild - Clean, Compile & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to rebuild',
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Rebuilding: ${argv.package ?? 'all'}`)
        process.exitCode = rebuild({ target: argv.target as 'esm' | 'cjs' })
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
