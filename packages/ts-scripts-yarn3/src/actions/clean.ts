import path from 'path/posix'

import { runSteps } from '../lib'

export interface CleanParams {
  pkg?: string
}

export const clean = () => {
  return runSteps('Clean', [
    [
      'yarn',
      `workspaces foreach -ptA exec ${path.join(
        (process.env.PROJECT_CWD ?? './').replace(/\\/g, '/'),
        '/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/clean.js',
      )}`,
    ],
  ])
}
