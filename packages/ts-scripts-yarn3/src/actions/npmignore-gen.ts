import chalk from 'chalk'

import { INIT_CWD, readNonEmptyLines, union, writeLines, yarnWorkspace, yarnWorkspaces } from '../lib'

const readEntries = (location: string): string[] => readNonEmptyLines(`${location}/.npmignore`)
const writeEntries = (location: string, entries: string[]) => writeLines(`${location}/.npmignore`, entries)
const mergeEntries = (a: string[], b: string[]): string[] => [...union(a, b)].sort()

export const npmignoreGen = (pkg?: string) => {
  console.log(chalk.green('Generate .npmignore Files'))
  const cwd = INIT_CWD() ?? '.'
  const workspaces = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  const results = workspaces.map(({ location, name }) => {
    try {
      writeEntries(location, mergeEntries(readEntries(cwd), readEntries(location)))
      return 0
    } catch (ex) {
      const error = ex as Error
      console.error(`Generate .npmignore Files [${name}] [${error.message}]`)
      return 1
    }
  })
  const succeeded = results.every((result) => result === 0)
  return succeeded ? 0 : 1
}
