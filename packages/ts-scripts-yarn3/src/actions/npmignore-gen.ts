import chalk from 'chalk'

import { INIT_CWD, readNonEmptyLines, union, writeLines, yarnWorkspace, yarnWorkspaces } from '../lib'

const readEntries = (location: string): string[] => readNonEmptyLines(`${location}/.npmignore`)
const writeEntries = (location: string, entries: string[]) => writeLines(`${location}/.npmignore`, entries)
const mergeEntries = (a: string[], b: string[]): string[] => [...union(a, b)].sort()

export const npmignoreGen = (pkg?: string) => {
  const workspaceList = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  console.log(chalk.green('Generate .npmignore Files'))
  const cwd = INIT_CWD() ?? '.'
  return workspaceList
    .map(({ location, name }) => {
      try {
        const root = readEntries(cwd)
        const pkg = readEntries(location)
        const merged = mergeEntries(root, pkg)
        writeEntries(location, merged)
        return 0
      } catch (ex) {
        const error = ex as Error
        console.error(`Generate .npmignore Files [${name}] [${error.message}]`)
        return 1
      }
    })
    .reduce((prev, value) => prev || value, 0)
}
