import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnusedDependencies(
  { name, location }: Workspace,
  { dependencies }: CheckPackageParams,
  {
    externalProdImports,
    externalProdTypeImports,
  }: CheckSourceParams,
) {
  let unusedDependencies = 0
  for (const dep of dependencies) {
    if (!externalProdImports.includes(dep) && !externalProdTypeImports.includes(dep)) {
      unusedDependencies++
      console.log(`[${chalk.blue(name)}] Unused dependency in package.json: ${chalk.red(dep)}`)
      console.log(`  ${location}/package.json\n`)
      console.log('')
    }
  }
  return unusedDependencies
}
