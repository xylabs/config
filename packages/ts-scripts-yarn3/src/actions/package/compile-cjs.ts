import { runStepsAsync } from '../../lib'
import { packageCopyAssets } from './copy-assets'
import { packageTsconfigGenCjs } from './tsconfig-gen-cjs'

export const packageCompileCjs = async () => {
  const pkg = process.env.INIT_CWD

  packageTsconfigGenCjs()
  return (
    await Promise.all([
      packageCopyAssets({ target: 'cjs' }),
      runStepsAsync('Package Compile [CJS]', [['tsc', ['--build', `${pkg}/.tsconfig.build.cjs.json`]]]),
    ])
  ).reduce((prev, value) => prev + value)
}
