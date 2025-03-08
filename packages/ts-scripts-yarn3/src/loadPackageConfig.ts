import { readFile } from 'node:fs/promises'

import type { PackageJson } from 'types-package-json'

export type PackageJsonEx = PackageJson & { type: 'module' | 'commonjs' }

export const loadPackageConfig = async () => {
  const pkg = process.env.INIT_CWD

  const pkgConfig = await readFile(`${pkg}/package.json`, { encoding: 'utf8' })

  return JSON.parse(pkgConfig) as PackageJsonEx
}
