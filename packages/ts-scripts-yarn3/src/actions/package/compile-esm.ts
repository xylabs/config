import { runStepsAsync } from '../../lib'
import { packageCopyAssets } from './copy-assets'
import { packageTsconfigGenEsm } from './tsconfig-gen-esm'

export const packageCompileEsm = async () => {
  const pkg = process.env.INIT_CWD

  packageTsconfigGenEsm()
  return (
    await Promise.all([
      packageCopyAssets({ target: 'esm' }),
      runStepsAsync('Package Compile [ESM]', [['tsc', ['--build', `${pkg}/.tsconfig.build.esm.json`]]]),
    ])
  ).reduce((prev, value) => prev + value)
}
