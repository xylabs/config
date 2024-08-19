import chalk from 'chalk'

import { readNonEmptyLines, writeLines } from './file/index.ts'
import { union } from './string/index.ts'
import {
  INIT_CWD, yarnWorkspace, yarnWorkspaces,
} from './yarn/index.ts'

const mergeEntries = (a: string[], b: string[]): string[] => [...union(a, b)].sort()

export const generateIgnoreFiles = (filename: string, pkg?: string) => {
  console.log(chalk.green(`Generate ${filename} Files`))
  const cwd = INIT_CWD() ?? '.'
  const workspaces = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  const readEntries = (location: string): string[] => readNonEmptyLines(`${location}/${filename}`)
  const writeEntries = (location: string, entries: string[]) => writeLines(`${location}/${filename}`, entries)
  const results = workspaces.map(({
    location, name,
  }) => {
    try {
      writeEntries(location, mergeEntries(readEntries(cwd), readEntries(location)))
      return 0
    } catch (ex) {
      const error = ex as Error
      console.error(`Generate ${filename} Files [${name}] [${error.message}]`)
      return 1
    }
  })
  const succeeded = results.every(result => result === 0)
  return succeeded ? 0 : 1
}
