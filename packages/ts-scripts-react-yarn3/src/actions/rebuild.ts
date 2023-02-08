import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const rebuild = () => {
  return runSteps('Rebuild', [
    ['yarn', 'xy clean'],
    ['yarn', 'xy build-ci'],
  ])
}
