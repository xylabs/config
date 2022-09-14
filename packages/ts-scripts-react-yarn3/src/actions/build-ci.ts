#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const buildci = () => {
  return runSteps('Build', [
    ['yarn', 'react-scripts build'],
    ['yarn', 'lint'],
    ['yarn', 'deps'],
    ['ts-node-script', './scripts/sitemap.ts'],
  ])
}
