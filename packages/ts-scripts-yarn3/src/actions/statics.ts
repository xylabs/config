import chalk from 'chalk'

import { detect, parsedPackageJSON } from '../lib'

const DefaultDependencies = ['axios', '@xylabs/pixel', 'react', 'graphql', 'react-router', '@mui/material', '@mui/styles', '@mui/system']

export const confirmStaticDependencies = () => {
  console.log(chalk.green('Confirming Static Dependencies'))

  const statics = parsedPackageJSON()?.xy?.deps?.statics

  return detect(statics, DefaultDependencies)
}

export const checkAllDependenciesForDuplicates = () => {
  console.log(chalk.green('Checking all Dependencies for Duplicates'))

  const allDependencies = parsedPackageJSON()?.dependencies
  const dependencies = Object.entries(allDependencies).map(([k]) => k)

  return detect(dependencies, DefaultDependencies)
}
