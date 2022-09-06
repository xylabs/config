import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const analyze = () => {
  return runSteps('Analyze', [['node', ['./node_modules/source-map-explorer/bin/cli.js', 'build/static/js/*.js']]])
}
