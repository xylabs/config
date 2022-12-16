import yargs from 'yargs'
// eslint-disable-next-line import/no-internal-modules
import { hideBin } from 'yargs/helpers'

import {
  build,
  clean,
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
  rebuild,
  reinstall,
  relint,
  sonar,
  test,
  tsconfigGen,
  tsconfigGenClean,
  up,
  updateYarnPlugins,
  updo,
  yarn3Only,
} from '../actions'

export const parseOptions = () => {
  return yargs(hideBin(process.argv))
    .option('verbose', {
      alias: 'v',
      default: false,
      description: 'Run with verbose logging',
      type: 'boolean',
    })
    .option('target', {
      alias: 't',
      choices: ['esm', 'cjs'],
      description: 'Limit output to specific target',
      type: 'string',
    })
    .option('fix', {
      alias: 'f',
      default: false,
      description: 'Try to fix errors',
      type: 'boolean',
    })
    .option('cache', {
      alias: 'c',
      default: false,
      description: 'Use caching for performance',
      type: 'boolean',
    })
    .option('profile', {
      alias: 'p',
      default: false,
      description: 'Profile action',
      type: 'boolean',
    })
}

export const xy = () => {
  return parseOptions()
    .command(
      'build [package]',
      'Build - Compile & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to build',
        })
      },
      (argv) => {
        if (argv.verbose) console.info(`Building: ${argv.package ?? 'all'}`)
        process.exitCode = build({ pkg: argv.package as string, target: argv.target as 'esm' | 'cjs' })
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
      (argv) => {
        if (argv.verbose) console.info(`Compiling: ${argv.package ?? 'all'}`)
        process.exitCode = compile({ pkg: argv.package as string, target: argv.target as 'esm' | 'cjs' })
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
      (argv) => {
        if (argv.verbose) console.info(`Copying Assets: ${argv.package ?? 'all'}`)
        process.exitCode = copyAssets({ target: argv.target as 'esm' | 'cjs' })
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
    .help().argv
}
