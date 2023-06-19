import { readFileSync } from 'fs'

import { packageCompileCjs } from './compile-cjs'
import { packageCompileEsm } from './compile-esm'

export const packageCompile = async () => {
  const pkg = process.env.INIT_CWD

  const pkgConfig = readFileSync(`${pkg}/package.json`, { encoding: 'utf8' })

  const config = JSON.parse(pkgConfig)

  return (await Promise.all(config.type === 'module' ? [packageCompileEsm()] : [packageCompileEsm(), packageCompileCjs()])).reduce(
    (prev, value) => prev + value,
    0,
  )
}
