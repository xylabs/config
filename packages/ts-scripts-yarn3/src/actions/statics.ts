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
  errors: string[]
  versions: string[]
}

const resultsFactory = (): Results => ({ currentVersion: undefined, errors: [], versions: [] })

const detectDuplicates = (output: DependencyEntries) => {
  const result = output.reduce((acc, entry) => {
    const entryVersion = Object.entries(entry.children).map(([k]) => k)[0]

    if (!acc.currentVersion) {
      acc.currentVersion = entryVersion
      return acc
    }

    if (acc.currentVersion && acc.currentVersion !== entryVersion) {
      const error = `currentVersion: ${acc.currentVersion} doesn't match entryVersion: ${entryVersion}`
      acc.errors.push(error)
    }
    return acc
  }, resultsFactory())

  if (result.errors.length) {
    console.error(result.errors)
    return 1
  } else {
    console.log('No Duplicates')
    return 0
  }
}

const formatOutput = (output: string) => {
  const withCommas = output.replace(/\r\n/g, '').replace(/\n/g, ',')
  const cleanCollection = withCommas.substring(0, withCommas.length - 1)
  const collection = `[${cleanCollection}]`
  return JSON.parse(collection)
}

export const confirmStaticPackages = () => {
  console.log(chalk.green('Confirming Static Packages'))
  return safeExit(() => {
    try {
      const cmd = 'yarn why lodash --json'
      const output = execSync(cmd).toString()
      if (output) {
        const parsedOutput = formatOutput(output)
        return detectDuplicates(parsedOutput)
      } else {
        console.log('Library was not found')
      }
      return 0
    } catch (e) {
      console.error(`Error running yarn why: ${e}`)
      return 1
    }
  })
}
