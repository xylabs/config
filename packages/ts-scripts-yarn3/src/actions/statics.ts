import chalk from 'chalk'
import { execSync } from 'child_process'

import { DetectDuplicates, parsedPackageJSON, safeExit } from '../lib'

const DefaultDependencies = ['axios', '@xylabs/pixel', 'react', 'graphql', 'react-router', '@mui/material', '@mui/styles', '@mui/system']

export const detectDuplicates = (depsFromPackageJSON?: string[]) => {
  let exitCode = 0

  const dependencies = depsFromPackageJSON?.length ? depsFromPackageJSON : DefaultDependencies

  return safeExit(() => {
    dependencies.forEach((dependency) => {
      let output: string

      try {
        const cmd = `yarn why ${dependency} --json`
        output = execSync(cmd).toString()
      } catch (e) {
        console.error(`Error running yarn why: ${e}`)
        exitCode = 1
        return
      }

      if (output) {
        exitCode = new DetectDuplicates(output, dependency).detect()
        return
      } else {
        console.log(dependency)
        if (depsFromPackageJSON) {
          console.log(`🚨 Library ${dependency} was requested in package.json but not found`)
        }
        exitCode = 1
        return
      }
    })
    return exitCode
  })
}

export const confirmStaticPackages = () => {
  console.log(chalk.green('Confirming Static Packages'))

  const statics = parsedPackageJSON()?.xy?.deps?.statics

  return detectDuplicates(statics)
}
