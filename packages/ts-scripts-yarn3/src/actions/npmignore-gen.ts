import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import chalk from 'chalk'

import { INIT_CWD, yarnWorkspaces } from '../lib'

const WINDOWS_NEWLINE_REGEX = /\r\n/g
const CROSS_PLATFORM_NEWLINE = '\n'
const opts = { encoding: 'utf-8' } as const

const empty = (value: string | undefined): boolean => value?.trim().length === 0
const notEmpty = (value: string | undefined): boolean => !empty(value)

const union = <TKey>(a: Set<TKey>, b: Set<TKey>): Set<TKey> => {
  return new Set([...a, ...b])
}

const getNpmIgnore = (location: string): string | undefined => {
  const npmignore = `${location}/.npmignore`
  return existsSync(npmignore) ? readFileSync(npmignore, opts) : undefined
}

const getNpmIgnoreEntries = (location: string): string[] => {
  const npmignore = `${location}/.npmignore`
  return existsSync(npmignore)
    ? readFileSync(npmignore, opts).replace(WINDOWS_NEWLINE_REGEX, CROSS_PLATFORM_NEWLINE).split(CROSS_PLATFORM_NEWLINE).filter(notEmpty)
    : []
}

const mergeNpmIgnoreEntries = (root: string[], pkg: string[]): string[] => {
  const filteredRoot = new Set(root.filter(notEmpty).sort())
  const filteredPkg = new Set(pkg.filter(notEmpty).sort())
  return [...union(filteredRoot, filteredPkg)].sort()
}

const writeNpmIgnore = (location: string, entries: string[]) => {
  const data = entries.join(CROSS_PLATFORM_NEWLINE)
  const npmignore = `${location}/.npmignore`
  const writeNewNpmIgnore = () => writeFileSync(npmignore, data, opts)
  // Check if the file is different before writing
  if (existsSync(npmignore)) {
    const existing = getNpmIgnore(location)
    if (existing !== data) {
      writeNewNpmIgnore()
    }
  } else {
    writeNewNpmIgnore()
  }
}

export const npmignoreGen = (pkg?: string) => {
  const workspaceList = yarnWorkspaces().filter(({ name }) => pkg === undefined || name === pkg)
  console.log(chalk.green('Generate .npmignore Files'))
  const cwd = INIT_CWD() ?? '.'
  return workspaceList
    .map(({ location, name }) => {
      try {
        const root = getNpmIgnoreEntries(cwd)
        const pkg = getNpmIgnoreEntries(location)
        const merged = mergeNpmIgnoreEntries(root, pkg)
        writeNpmIgnore(location, merged)
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`Generate .npmignore Files [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
