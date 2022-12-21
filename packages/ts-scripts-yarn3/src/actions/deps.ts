import { runSteps } from '../lib'

export const deps = () => {
  return runSteps('Deps', [['yarn', 'workspaces foreach -ptA run package-deps']])
}
