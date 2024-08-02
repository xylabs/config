import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const analyze = () => {
  return runSteps('Analyze', [['yarn', ['source-map-explorer', 'build/static/js/*.ts']]])
}
