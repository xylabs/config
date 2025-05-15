import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getUnusedDependencies(
  { name, location }: Workspace,
  { dependencies }: CheckPackageParams,
  {
    externalDistImports,
    externalSrcImports,
  }: CheckSourceParams,
) {
  let unusedDependencies = 0
  for (const dep of dependencies) {
    if (!externalDistImports.includes(dep)) {
      unusedDependencies++
      if (externalSrcImports.includes(dep)) {
        console.log(`[${chalk.blue(name)}] dependency should be devDependency in package.json: ${chalk.red(dep)}`)
      } else {
        console.log(`[${chalk.blue(name)}] Unused dependency in package.json: ${chalk.red(dep)}`)
      }
    }
  }
  if (unusedDependencies > 0) {
    const packageLocation = `${location}/package.json`
    console.log(`  ${chalk.yellow(packageLocation)}\n`)
  }
  return unusedDependencies
}
