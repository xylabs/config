#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const clean = () => {
  runSteps('Clean', [
    ['node', ['./node_modules/rimraf/bin.js', '-q', 'dist']],
    ['node', ['./node_modules/rimraf/bin.js', '-q', 'build']],
    ['node', ['./node_modules/rimraf/bin.js', '-q', '.eslintcache']],
  ])
}
