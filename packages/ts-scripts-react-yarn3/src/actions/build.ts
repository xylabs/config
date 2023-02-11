import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const build = () => {
  return runSteps('Build', [
    ['yarn', ['xy', 'compile']],
    ['yarn', 'xy lint'],
    ['yarn', 'xy deps'],
    ['ts-node-script', './scripts/sitemap.ts'],
  ])
}
