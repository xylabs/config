#!/usr/bin/env node

import { parseOptions, xy } from '@xylabs/ts-scripts-yarn3'
import { Argv } from 'yargs'

import { analyze, clean } from '../actions'

export const xyReact = () =>
  xy(async (yargs: Argv) => {
    const options = await parseOptions(yargs)
    return yargs
      .command(
        'clean [package]',
        'Clean - Remove intermediate files',
        (yargs) => {
          return yargs.positional('package', {
            describe: 'Specific package to clean',
          })
        },
        () => {
          if (options.verbose) console.info(`Cleaning: ${options.package ?? 'all'}`)
          process.exitCode = clean()
        },
      )
      .command(
        'analyze',
        'Analyze - Analyze Bundles',
        (yargs) => {
          return yargs
        },
        () => {
          if (options.verbose) console.info('Analyzing')
          process.exitCode = analyze()
        },
      )
  })
