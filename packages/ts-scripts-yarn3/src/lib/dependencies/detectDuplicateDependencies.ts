import { execSync } from 'node:child_process'

import { safeExit } from '../safeExit'
import { DuplicateDetector } from './DuplicateDetector'

export const detectDuplicateDependencies = (depsFromPackageJSON?: string[], DefaultDependencies?: string[]) => {
  let exitCode = 0

  const dependencies = depsFromPackageJSON?.length ? depsFromPackageJSON : DefaultDependencies

  return safeExit(() => {
    if (dependencies) {
      for (const dependency of dependencies) {
        let output: string

        try {
          const cmd = `yarn why ${dependency} --json`
          output = execSync(cmd).toString()
        } catch (e) {
          console.error(`Error running yarn why: ${e}`)
          exitCode = 1
          exitCode
          continue
        }

        if (output) {
          exitCode = new DuplicateDetector(output, dependency).detect()
          exitCode
          continue
        } else {
          console.log(`${dependency} - N/A`)
          if (depsFromPackageJSON) {
            exitCode = 1
            console.log(`🚨 Library ${dependency} was requested in package.json but not found`)
          }
          exitCode
          continue
        }
      }
      return exitCode
    } else {
      console.log('🚨 No dependencies where passed')
      return exitCode
    }
  })
}
