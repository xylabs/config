import chalk from 'chalk'
import { execSync } from 'child_process'

import { safeExit } from '../lib'

interface DependencyEntry {
  children: Record<string, Record<string, string>>
  value: string
}

type DependencyEntries = DependencyEntry[]

interface Results {
  currentVersion: string | undefined
  duplicateVersions: string[]
  errors: string[]
}

class DetectDuplicates {
  private dependencyEntries: DependencyEntries

  constructor(output: string) {
    this.dependencyEntries = this.formatOutput(output)
  }

  public detect() {
    const result = this.dependencyEntries.reduce(this.detectReducer, this.resultsFactory())
    if (result.errors.length) {
      console.error('Errors: ', result.errors)
      console.error('Duplicate Versions: ', result.duplicateVersions)
      return 1
    } else {
      console.log('No Duplicates')
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
      const error = `currentVersion: ${acc.currentVersion} doesn't match version: ${version}`
      acc.errors.push(error)
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

  private resultsFactory = (): Results => ({ currentVersion: undefined, duplicateVersions: [], errors: [] })
}

export const confirmStaticPackages = () => {
  console.log(chalk.green('Confirming Static Packages'))
  return safeExit(() => {
    let output: string

    try {
      const cmd = 'yarn why lodash --json'
      output = execSync(cmd).toString()
    } catch (e) {
      console.error(`Error running yarn why: ${e}`)
      return 1
    }

    if (output) {
      return new DetectDuplicates(output).detect()
    } else {
      console.log('Library was not found')
    }
    return 0
  })
}
