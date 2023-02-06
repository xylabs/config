import chalk from 'chalk'

import { detectDuplicateDependencies, parsedPackageJSON } from '../lib'

const DefaultDependencies = ['axios', '@xylabs/pixel', 'react', 'graphql', 'react-router', '@mui/material', '@mui/styles', '@mui/system']

export const statics = () => {
  console.log(chalk.green('Check Required Static Dependencies'))

  const statics = parsedPackageJSON()?.xy?.deps?.statics

  return detectDuplicateDependencies(statics, DefaultDependencies)
}
