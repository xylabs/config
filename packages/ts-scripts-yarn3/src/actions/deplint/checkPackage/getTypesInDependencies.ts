import chalk from 'chalk'

import type { Workspace } from '../../../lib/index.ts'
import type { CheckPackageParams, CheckSourceParams } from './checkPackageTypes.ts'

export function getTypesInDependencies({ name, location }: Workspace, { dependencies }: CheckPackageParams, {}: CheckSourceParams) {
  let typesInDependencies = 0
  for (const dep of dependencies) {
    if (dep.startsWith('@types/')) {
      typesInDependencies++
      console.log(`[${chalk.blue(name)}] @types in dependencies in package.json: ${chalk.red(dep)}`)
      console.log(`  ${location}/package.json\n`)
      console.log('')
    }
  }
  return typesInDependencies
}
