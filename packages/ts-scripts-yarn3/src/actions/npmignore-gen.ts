import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import chalk from 'chalk'

import { INIT_CWD, yarnWorkspaces } from '../lib'

const WINDOWS_NEWLINE_REGEX = /\r\n/g
const CROSS_PLATFORM_NEWLINE = '\n'
const fileOpts = { encoding: 'utf-8' } as const

const notEmpty = (value: string | undefined): boolean => value?.trim().length !== 0

const union = <TKey>(a: Set<TKey>, b: Set<TKey>): Set<TKey> => {
  return new Set([...a, ...b])
}

const getNpmIgnore = (location: string): string[] => {
  const file = `${location}/.npmignore`
  return existsSync(file)
    ? readFileSync(file, fileOpts).replace(WINDOWS_NEWLINE_REGEX, CROSS_PLATFORM_NEWLINE).split(CROSS_PLATFORM_NEWLINE).filter(notEmpty)
    : []
}

const mergeWithPrecedence = (root: string[], pkg: string[]): string[] => {
  const filteredRoot = new Set(root.filter(notEmpty).sort())
  const filteredPkg = new Set(pkg.filter(notEmpty).sort())
  return [...union(filteredRoot, filteredPkg)].sort()
}

const writeNpmIgnore = (location: string, entries: string[]) => {
  // TODO: Check if the file is different before writing
  const data = entries.join(CROSS_PLATFORM_NEWLINE)
  writeFileSync(`${location}/.npmignore`, data, fileOpts)
}

export const npmignoreGen = (pkg?: string) => {
  const workspaces = yarnWorkspaces()
  const workspaceList = workspaces.filter(({ name }) => {
    return pkg === undefined || name === pkg
  })

  console.log(chalk.green('Generate .npmignore Files'))

  return workspaceList
    .map(({ location, name }) => {
      try {
        const cwd = INIT_CWD() ?? '.'
        const root = getNpmIgnore(cwd)
        const pkg = getNpmIgnore(location)
        writeNpmIgnore(location, mergeWithPrecedence(root, pkg))
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`Generate .npmignore Files [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
