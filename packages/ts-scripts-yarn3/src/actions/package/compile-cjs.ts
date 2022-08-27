import { rmSync } from 'fs'

import { runSteps } from '../../lib'

export const packageCompileCjs = () => {
  const pkg = process.env.INIT_CWD

  const dist = `${pkg}/dist/cjs`
  rmSync(dist, { force: true, recursive: true })
  rmSync(`${pkg}/dist/.tsconfig.build.cjs.tsbuildinfo`, { force: true, recursive: true })

  runSteps('Package Compile [CJS]', [['tsc', ['-p', `${pkg}/.tsconfig.build.cjs.json`]]])
}
