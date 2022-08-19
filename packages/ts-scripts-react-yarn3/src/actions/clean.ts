#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const clean = () => {
  runSteps('Clean', [
    ['./node_modules/rimraf/bin.js', ['-q', 'dist']],
    ['./node_modules/rimraf/bin.js', ['-q', 'build']],
    ['./node_modules/rimraf/bin.js', ['-q', '.eslintcache']],
  ])
}
