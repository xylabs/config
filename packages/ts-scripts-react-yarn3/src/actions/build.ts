import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const build = () => {
  return runSteps('Build', [
    ['yarn', 'version patch --deferred'],
    ['yarn', 'xy build-ci'],
  ])
}
