import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const deps = () => {
  runSteps('Deps', [['node', ['./node_modules/depcheck/bin/depcheck.js', '.']]])
}
