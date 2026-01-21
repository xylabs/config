import { runSteps } from '../lib/index.ts'

export const publish = () => {
  return runSteps('Publish', [['npm', ['publish', '--workspaces']]])
}
