#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const buildci = () => {
  return runSteps('Build', [
    ['yarn', ['xy', 'compile']],
    ['yarn', 'react-scripts build'],
    ['yarn', 'xy lint'],
    ['yarn', 'xy deps'],
    ['ts-node-script', './scripts/sitemap.ts'],
  ])
}
