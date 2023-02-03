// eslint-disable-next-line import/no-internal-modules
import uniq from 'lodash/uniq'
import { EOL } from 'os'

import { multiLineToJSONArray } from '../jsonFormatters'

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

export class DuplicateDetector {
  private dependency: string
  private dependencyEntries: DependencyEntries

  constructor(output: string, dependency: string) {
    this.dependency = dependency
    this.dependencyEntries = multiLineToJSONArray(output)
  }

  public detect() {
    const result = this.dependencyEntries.reduce(this.detectReducer, this.resultsFactory(this.dependency))
    if (result.duplicateVersions.length) {
      console.error(`${EOL}🚨 Duplicates found for: ${this.dependency} ${EOL}`)
      console.error(result.duplicateVersions.toString().replaceAll(',', EOL), EOL)
      return 1
    } else {
      console.log(`👍 ${this.dependency}`)
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
      // if first duplicate, push the current version as the first duplicate
      if (acc.duplicateVersions.length === 0) {
        acc.duplicateVersions.push(acc.currentVersion)
      }
      acc.duplicateVersions.push(version)
      acc.duplicateVersions = uniq(acc.duplicateVersions)
    }
    return acc
  }

  private resultsFactory = (dependency: string): Results => ({ currentVersion: undefined, dependency, duplicateVersions: [] })
}
