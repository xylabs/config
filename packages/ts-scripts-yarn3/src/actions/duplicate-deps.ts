import chalk from 'chalk'

import { detect, parsedPackageJSON } from '../lib'

export const checkAllDependenciesForDuplicates = () => {
  console.log(chalk.green('Checking all Dependencies for Duplicates'))

  const allDependencies = parsedPackageJSON()?.dependencies
  const dependencies = Object.entries(allDependencies).map(([k]) => k)

  return detect(dependencies)
}
