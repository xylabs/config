#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const clean = () => {
  return runSteps('Clean', [
    ['yarn', ['xy', 'rimraf', '-q', 'dist']],
    ['yarn', ['xy', 'rimraf', '-q', 'build']],
    ['yarn', ['xy', 'rimraf', '-q', '.eslintcache']],
  ])
}
