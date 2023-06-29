import chalk from 'chalk'

import { CROSS_PLATFORM_NEWLINE, INIT_CWD, readNonEmptyLines, tryReadFileSync, union, writeLines, yarnWorkspace, yarnWorkspaces } from '../lib'

const writeNpmIgnore = (location: string, entries: string[]) => {
  const existing = tryReadFileSync(`${location}/.npmignore`)
  const desired = entries.join(CROSS_PLATFORM_NEWLINE)
  // Check if the file is different before writing
  if (existing !== desired) writeLines(`${location}/.npmignore`, entries)
}

const getEntries = (location: string): string[] => readNonEmptyLines(`${location}/.npmignore`).sort()
const mergeEntries = (a: string[], b: string[]): string[] => [...union(a, b)].sort()

export const npmignoreGen = (pkg?: string) => {
  const workspaceList = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  console.log(chalk.green('Generate .npmignore Files'))
  const cwd = INIT_CWD() ?? '.'
  return workspaceList
    .map(({ location, name }) => {
      try {
        const root = getEntries(cwd)
        const pkg = getEntries(location)
        const merged = mergeEntries(root, pkg)
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
