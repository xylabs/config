import chalk from 'chalk'
import type { Argv } from 'yargs'

import {
  cycle, deplint, fix, knip, lint, publint, relint, sonar,
} from '../actions/index.ts'
import { packagePositionalParam } from './param.ts'

export const xyLintCommands = (args: Argv) => {
  return args
    .command(
      'cycle [package]',
      'Cycle - Check for dependency cycles',
      (yargs) => {
        return packagePositionalParam(yargs)
      },
      async (argv) => {
        const start = Date.now()
        if (argv.verbose) console.log('Cycle')
        process.exitCode = await cycle({ pkg: argv.package as string })
        console.log(chalk.blue(`Finished in ${Date.now() - start}ms`))
      },
    )
    .command(
      'lint [package]',
      'Lint - Run Eslint',
      (yargs) => {
        return packagePositionalParam(yargs)
          .option('fix', {
            alias: 'f',
            default: false,
            description: 'Fix fixable issues',
            type: 'boolean',
          })
          .option('cache', {
            alias: 'c',
            default: false,
            description: 'Use caching for performance',
            type: 'boolean',
          })
      },
      (argv) => {
        if (argv.verbose) console.log('Lint')
        const start = Date.now()
        process.exitCode
          = argv.fix
            ? fix({ pkg: argv.package, cache: argv.cache })
            : lint({ pkg: argv.package, cache: argv.cache })
        console.log(chalk.blue(`Finished in ${Date.now() - start}ms`))
      },
    )
    .command(
      'deplint [package]',
      'Deplint - Run Deplint',
      (yargs) => {
        return packagePositionalParam(yargs)
          .option('deps', {
            alias: 'd',
            default: false,
            description: 'Check dependencies',
            type: 'boolean',
          })
          .option('devDeps', {
            alias: 'v',
            default: false,
            description: 'Check devDependencies',
            type: 'boolean',
          })
          .option('peerDeps', {
            alias: 'p',
            default: false,
            description: 'Check peerDependencies',
            type: 'boolean',
          })
      },
      (argv) => {
        if (argv.verbose) console.log('Deplint')
        const start = Date.now()
        process.exitCode = deplint({
          pkg: argv.package as string, deps: !!argv.deps, devDeps: !!argv.devDeps, peerDeps: !!argv.peerDeps,
        })
        console.log(chalk.blue(`Finished in ${Date.now() - start}ms`))
      },
    )
    .command(
      'fix [package]',
      'Fix - Run Eslint w/fix',
      (yargs) => {
        return packagePositionalParam(yargs)
      },
      (argv) => {
        const start = Date.now()
        if (argv.verbose) console.log('Fix')
        process.exitCode = fix()
        console.log(chalk.blue(`Finished in ${Date.now() - start}ms`))
      },
    )
    .command(
      'relint [package]',
      'Relint - Clean & Lint',
      (yargs) => {
        return packagePositionalParam(yargs)
      },
      (argv) => {
        if (argv.verbose) console.log('Relinting')
        const start = Date.now()
        process.exitCode = relint()
        console.log(chalk.blue(`Finished in ${Date.now() - start}ms`))
      },
    )
    .command(
      'publint [package]',
      'Publint - Run Publint',
      (yargs) => {
        return packagePositionalParam(yargs)
      },
      async (argv) => {
        if (argv.verbose) console.log('Publint')
        const start = Date.now()
        process.exitCode = await publint({ pkg: argv.package as string, verbose: !!argv.verbose })
        console.log(chalk.blue(`Finished in ${Date.now() - start}ms`))
      },
    )
    .command(
      'knip',
      'Knip - Run Knip',
      (yargs) => {
        return packagePositionalParam(yargs)
      },
      (argv) => {
        if (argv.verbose) console.log('Knip')
        const start = Date.now()
        process.exitCode = knip()
        console.log(chalk.blue(`Knip finished in ${Date.now() - start}ms`))
      },
    )
    .command(
      'sonar',
      'Sonar - Run Sonar Check',
      (yargs) => {
        return packagePositionalParam(yargs)
      },
      (argv) => {
        const start = Date.now()
        if (argv.verbose) console.log('Sonar Check')
        process.exitCode = sonar()
        console.log(chalk.blue(`Finished in ${Date.now() - start}ms`))
      },
    )
}
