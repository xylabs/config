import { runSteps } from '../lib'

export interface CleanParams {
  pkg?: string
}

export const clean = () => {
  const proj = process.env.PROJECT_CWD
  runSteps('Clean', [['yarn', `workspaces foreach -pA exec ${proj}/node_modules/.bin/package-clean`]])
}
