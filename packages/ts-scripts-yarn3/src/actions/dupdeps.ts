import chalk from 'chalk'

import { detectDuplicateDependencies, parsedPackageJSON } from '../lib'

export const dupdeps = () => {
  console.log(chalk.green('Checking all Dependencies for Duplicates'))

  const allDependencies = parsedPackageJSON()?.dependencies
  const dependencies = Object.entries(allDependencies).map(([k]) => k)

  return detectDuplicateDependencies(dependencies)
}
