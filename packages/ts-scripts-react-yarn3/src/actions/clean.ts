#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const clean = () => {
  return runSteps('Clean', [
    ['yarn', ['rimraf', '-q', 'dist']],
    ['yarn', ['rimraf', '-q', 'build']],
    ['yarn', ['rimraf', '-q', '.eslintcache']],
  ])
}
