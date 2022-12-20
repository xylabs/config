import { runSteps } from '../lib'

export interface CleanParams {
  pkg?: string
}

export const clean = () => {
  return runSteps('Clean', [['yarn', 'workspaces foreach -ptA run package-clean']])
}
