import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import chalk from 'chalk'

import { INIT_CWD, yarnWorkspaces } from '../lib'

const empty = (value: string | undefined): boolean => value?.trim().length === 0

const union = <TKey>(a: Set<TKey>, b: Set<TKey>): Set<TKey> => {
  return new Set([...a, ...b])
}

const getNpmIgnore = (location: string): string[] => {
  return existsSync(location) ? readFileSync(`${location}/.npmignore`, { encoding: 'utf8' }).replace(/\r\n/g, '\n').split('\n').filter(empty) : []
}

const mergeWithPrecedence = (root: string[], pkg: string[]): string[] => {
  const filteredRoot = new Set(root.filter(empty).sort())
  const filteredPkg = new Set(pkg.filter(empty).sort())
  return [...union(filteredRoot, filteredPkg)].sort()
}

const writeNpmIgnore = (location: string, entries: string[]) => {
  // TODO: Check if the file is different before writing
  writeFileSync(`${location}/.npmignore`, entries.join('\n'), { encoding: 'utf8' })
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
        console.error(`tsconfig (CJS) generate failed [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
