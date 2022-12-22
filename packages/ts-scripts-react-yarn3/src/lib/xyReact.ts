#!/usr/bin/env node

import { xyCommonCommands, xyInstallCommands, xyLintCommands, xyParseOptions } from '@xylabs/ts-scripts-yarn3'

import { analyze, eject, sitemap, start } from '../actions'
import { xyReactBuildCommands } from './xyReactBuildCommands'

export const xyReact = () => {
  return xyReactBuildCommands(xyInstallCommands(xyLintCommands(xyInstallCommands(xyCommonCommands(xyParseOptions())))))
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
