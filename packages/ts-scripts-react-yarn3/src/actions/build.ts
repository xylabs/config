#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const build = () => {
  return runSteps('Build', [
    ['yarn', 'version patch --deferred'],
    ['yarn', 'build-ci'],
  ])
}
