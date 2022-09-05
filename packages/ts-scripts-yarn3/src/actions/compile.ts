import { runSteps, ScriptStep } from '../lib'

export interface CompileParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const compile = ({ target }: CompileParams) => {
  const proj = process.env.PROJECT_CWD
  const cjsSteps: ScriptStep[] =
    target && target !== 'cjs'
      ? [
          ['yarn', ['tsconfig-gen:cjs']],
          ['yarn', `workspaces foreach -ptA exec ${proj}/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/compile-cjs.js`],
          ['yarn', ['copy-assets', '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    target && target !== 'esm'
      ? [
          ['yarn', ['tsconfig-gen:esm']],
          ['yarn', `workspaces foreach -ptA exec ${proj}/node_modules/@xylabs/ts-scripts-yarn3/dist/cjs/bin/package/compile-esm.js`],
          ['yarn', ['copy-assets', '-t', 'esm']],
        ]
      : []

  runSteps('Compile', [...esmSteps, ...cjsSteps, ['yarn', 'deps']])
}
