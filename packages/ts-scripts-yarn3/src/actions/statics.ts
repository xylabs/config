import chalk from 'chalk'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

import { safeExit } from '../lib'

const DefaultDependencies = ['axios', '@xylabs/pixel', 'react', 'graphql', 'react-router', '@mui/material', '@mui/styles']

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

export const detectDuplicates = (depsFromPackageJSON?: string[]) => {
  let exitCode = 0
  let dependencies: string[]
  return safeExit(() => {
    if (depsFromPackageJSON?.length === 0) {
      dependencies = DefaultDependencies
    } else {
      dependencies = depsFromPackageJSON
    }

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

  const pathToPackageJSON = `${process.cwd()}/package.json`
  const packageJSON = readFileSync(pathToPackageJSON).toString()
  const parsedPackageJSON = JSON.parse(packageJSON)
  const statics = parsedPackageJSON?.xy?.deps.statics

  return detectDuplicates(statics)
}
