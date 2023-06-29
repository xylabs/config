import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import chalk from 'chalk'

import { INIT_CWD, yarnWorkspace, yarnWorkspaces } from '../lib'

const WINDOWS_NEWLINE_REGEX = /\r\n/g
const CROSS_PLATFORM_NEWLINE = '\n'
const opts = { encoding: 'utf-8' } as const

const empty = (value?: string | undefined): boolean => value?.trim().length === 0
const notEmpty = (value?: string | undefined): boolean => !empty(value)

const union = (a: string[], b: string[]): Set<string> => new Set([...new Set(a), ...new Set(b)])

const readNpmIgnore = (location: string): string | undefined => {
  const npmignore = `${location}/.npmignore`
  return existsSync(npmignore) ? readFileSync(npmignore, opts) : undefined
}

const writeNpmIgnore = (location: string, entries: string[]) => {
  const npmignore = `${location}/.npmignore`
  const data = entries.join(CROSS_PLATFORM_NEWLINE)
  // Check if the file is different before writing
  if (readNpmIgnore(location) !== data) writeFileSync(npmignore, data, opts)
}

const getNpmIgnoreEntries = (location: string): string[] => {
  const npmignore = `${location}/.npmignore`
  return existsSync(npmignore)
    ? readFileSync(npmignore, opts).replace(WINDOWS_NEWLINE_REGEX, CROSS_PLATFORM_NEWLINE).split(CROSS_PLATFORM_NEWLINE).filter(notEmpty).sort()
    : []
}

const mergeNpmIgnoreEntries = (a: string[], b: string[]): string[] => [...union(a, b)].sort()

export const npmignoreGen = (pkg?: string) => {
  const workspaceList = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
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
