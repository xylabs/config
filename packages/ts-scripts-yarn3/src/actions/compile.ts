import path from 'path/posix'

import { runSteps, ScriptStep } from '../lib'

export interface CompileParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const compile = ({ target }: CompileParams) => {
  const proj = (process.env.PROJECT_CWD ?? './').replace(/\\/g, '/')
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'cjs']],
          ['yarn', `workspaces foreach -ptA exec ${path.join(proj, '/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/compile-cjs.js')}`],
          ['yarn', ['xy', 'copy-assets', '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'esm']],
          ['yarn', `workspaces foreach -ptA exec ${path.join(proj, '/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/compile-esm.js')}`],
          ['yarn', ['xy', 'copy-assets', '-t', 'esm']],
        ]
      : []

  return runSteps('Compile', [...esmSteps]) || runSteps('Compile', [...cjsSteps]) || runSteps('Compile', [['yarn', 'deps']])
}
