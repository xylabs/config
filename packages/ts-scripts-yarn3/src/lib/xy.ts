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
  updo,
  yarn3Only,
} from '../actions'

const parseOptions = async (yargsInstance: typeof yargs) => {
  return await yargsInstance
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
    .parse()
}

export const xy = async () => {
  const yargsInstance = yargs(hideBin(process.argv))
  const options = await parseOptions(yargsInstance)

  await yargsInstance
    .command(
      'build [package]',
      'Build - Compile & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to build',
        })
      },
      (argv) => {
        if (options.verbose) console.info(`Building: ${argv.package ?? 'all'}`)
        process.exitCode = build({ target: options.target as 'esm' | 'cjs' })
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
        if (options.verbose) console.info(`Compiling: ${argv.package ?? 'all'}`)
        process.exitCode = await compile({ target: options.target as 'esm' | 'cjs' })
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
        if (options.verbose) console.info(`Cleaning: ${argv.package ?? 'all'}`)
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
        if (options.verbose) console.info(`License: ${argv.package ?? 'all'}`)
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
        if (options.verbose) console.info(`Copying Assets: ${argv.package ?? 'all'}`)
        process.exitCode = copyAssets({ target: options.target as 'esm' | 'cjs' })
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
      () => {
        if (options.verbose) console.info('Cycle')
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
      () => {
        if (options.verbose) console.info('Dead')
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
      () => {
        if (options.verbose) console.info('Lint')
        process.exitCode = options.fix ? fix() : options.profile ? lintProfile() : options.cache ? lintFast() : lint()
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
      () => {
        if (options.verbose) console.info('Fix')
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
      () => {
        if (options.verbose) console.info('Deps')
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
      () => {
        if (options.verbose) console.info('Deps')
        process.exitCode = genDocs()
      },
    )
    .command(
      'gitlint [package]',
      'Gitlint - Lint your git config',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Gitlint')
        process.exitCode = options.fix ? gitlintFix() : gitlint()
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
      () => {
        if (options.verbose) console.info(`Rebuilding: ${options.package ?? 'all'}`)
        process.exitCode = rebuild({ target: options.target as 'esm' | 'cjs' })
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
      () => {
        if (options.verbose) console.info('Relinting')
        process.exitCode = relint()
      },
    )
    .command(
      'reinstall',
      'Reinstall - Clean & Install',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Reinstalling')
        process.exitCode = reinstall()
      },
    )
    .command(
      'sonar',
      'Sonar - Run Sonar Check',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Sonar Check')
        process.exitCode = sonar()
      },
    )
    .command(
      'test',
      'Test - Run Jest Tests',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Testing')
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
      () => {
        if (options.verbose) console.info(`TsconfigGen: ${options.package ?? 'all'}`)
        process.exitCode = tsconfigGen({ target: options.target as 'esm' | 'cjs' })
      },
    )
    .command(
      'tsconfig-clean',
      'Tsconfig Clean - Remove generated tsconfig.json files',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Tsconfig Clean')
        process.exitCode = tsconfigGenClean()
      },
    )
    .command(
      'up',
      'Up - Update dependencies',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Up')
        process.exitCode = up()
      },
    )
    .command(
      'updo',
      'Updo - Update dependencies [Interactive]',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Updo')
        process.exitCode = updo()
      },
    )
    .command(
      'yarn3only',
      'Yarn3Only - Check if using Yarn v3',
      (yargs) => {
        return yargs
      },
      () => {
        if (options.verbose) console.info('Yarn 3 Check')
        process.exitCode = yarn3Only()
      },
    )
    .parse()
}
