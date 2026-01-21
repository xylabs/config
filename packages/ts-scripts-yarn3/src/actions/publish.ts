import { runSteps } from '../lib/index.ts'

export const publish = () => {
  return runSteps('Publish', [['yarn', ['npm', 'publish', '--workspaces']]])
}
