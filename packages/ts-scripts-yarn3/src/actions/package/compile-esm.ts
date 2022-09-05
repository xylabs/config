import { rmSync } from 'fs'

import { runSteps } from '../../lib'

export const packageCompileEsm = () => {
  const pkg = process.env.INIT_CWD

  const dist = `${pkg}/dist/esm`
  rmSync(dist, { force: true, recursive: true })
  rmSync(`${pkg}/dist/.tsconfig.build.esm.tsbuildinfo`, { force: true, recursive: true })

  return runSteps('Package Compile [ESM]', [['tsc', ['-p', `${pkg}/.tsconfig.build.esm.json`]]])
}
