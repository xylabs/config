#!/usr/bin/env node

import { xyBuildCommands, xyCommonCommands, xyInstallCommands, xyLintCommands, xyParseOptions } from '@xylabs/ts-scripts-yarn3'
import chalk from 'chalk'

import { analyze, eject, sitemap, start } from '../actions'

export const xyReact = () => {
  return xyBuildCommands(xyInstallCommands(xyLintCommands(xyInstallCommands(xyCommonCommands(xyParseOptions())))))
    .command(
      'analyze',
      'Analyze - Analyze Bundles',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Analyzing')
        process.exitCode = analyze()
      },
    )
    .command(
      'eject',
      'Eject - Eject React project',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Ejecting')
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
        if (argv.verbose) console.log('Generating Sitemap')
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
        if (argv.verbose) console.log('Starting')
        process.exitCode = start()
      },
    )
    .demandCommand(1)
    .command('*', '', () => {
      console.error(chalk.yellow(`Command not found [${chalk.magenta(process.argv[2])}]`))
      console.log(chalk.gray("Try 'yarn xy --help' for list of commands"))
    })
    .help().argv
}
