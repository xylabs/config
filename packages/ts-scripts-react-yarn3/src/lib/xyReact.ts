#!/usr/bin/env node

import { xy } from '@xylabs/ts-scripts-yarn3'
import { Argv } from 'yargs'

import { analyze, build, buildci, clean, eject, sitemap, start, test } from '../actions'

export const xyReact = () =>
  xy((yargs: Argv) => {
    return yargs
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
  })
