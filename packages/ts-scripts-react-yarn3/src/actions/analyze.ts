import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const analyze = () => {
  return runSteps('Analyze', [['yarn', ['./node_modules/source-map-explorer/bin/cli.js', 'build/static/js/*.js']]])
}
