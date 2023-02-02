import chalk from 'chalk'
import { execSync } from 'child_process'

import { safeExit } from '../lib'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestCases = {
  failure: 'normalize-package-data',
  success: 'lodash',
}

interface DependencyEntry {
  children: Record<string, Record<string, string>>
  value: string
}

type DependencyEntries = DependencyEntry[]

interface Results {
  currentVersion: string | undefined
  dependency: string
  duplicateVersions: string[]
}

class DetectDuplicates {
  private dependency: string
  private dependencyEntries: DependencyEntries

  constructor(output: string, dependency: string) {
    this.dependency = dependency
    this.dependencyEntries = this.formatOutput(output)
  }

  public detect() {
    const result = this.dependencyEntries.reduce(this.detectReducer, this.resultsFactory(this.dependency))
    if (result.duplicateVersions.length) {
      console.error(`\n🚨 Duplicates found for: ${this.dependency} \n`)
      console.error(result.duplicateVersions.toString().replaceAll(',', '\n'), '\n')
      return 1
    } else {
      console.log(`👍 No Duplicates of ${this.dependency}`)
      return 0
    }
  }

  private detectReducer(acc: Results, entry: DependencyEntry) {
    const version = Object.entries(entry.children).map(([k]) => k)[0]

    if (!acc.currentVersion) {
      acc.currentVersion = version
      return acc
    }

    if (acc.currentVersion && acc.currentVersion !== version) {
      acc.duplicateVersions.push(version)
    }
    return acc
  }

  private formatOutput(output: string) {
    const withCommas = output.replace(/\r\n/g, '').replace(/\n/g, ',')
    const cleanCollection = withCommas.substring(0, withCommas.length - 1)
    const collection = `[${cleanCollection}]`
    return JSON.parse(collection)
  }

  private resultsFactory = (dependency: string): Results => ({ currentVersion: undefined, dependency, duplicateVersions: [] })
}

export const confirmStaticPackages = (dependencies = [TestCases.success]) => {
  console.log(chalk.green('Confirming Static Packages'))
  let exitCode = 0
  return safeExit(() => {
    if (dependencies) {
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
          console.log(`🚨 Library ${dependency} was not found`)
          exitCode = 1
          return
        }
      })
      return exitCode
    } else {
      console.log('No dependencies required static checks')
    }
  })
}
