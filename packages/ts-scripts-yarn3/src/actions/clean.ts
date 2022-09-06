import { runSteps } from '../lib'

export interface CleanParams {
  pkg?: string
}

export const clean = () => {
  const proj = process.env.PROJECT_CWD
  return runSteps('Clean', [['yarn', `workspaces foreach -ptA exec ${proj}/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/clean`]])
}
