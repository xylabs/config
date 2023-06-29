import chalk from 'chalk'

import { INIT_CWD, readNonEmptyLines, union, writeLines, yarnWorkspace, yarnWorkspaces } from '../lib'

const filename = '.npmignore'

const readEntries = (location: string): string[] => readNonEmptyLines(`${location}/${filename}`)
const writeEntries = (location: string, entries: string[]) => writeLines(`${location}/${filename}`, entries)
const mergeEntries = (a: string[], b: string[]): string[] => [...union(a, b)].sort()

export const generateIgnoreFiles = (pkg?: string) => {
  console.log(chalk.green(`Generate ${filename} Files`))
  const cwd = INIT_CWD() ?? '.'
  const workspaces = pkg ? [yarnWorkspace(pkg)] : yarnWorkspaces()
  const results = workspaces.map(({ location, name }) => {
    try {
      writeEntries(location, mergeEntries(readEntries(cwd), readEntries(location)))
      return 0
    } catch (ex) {
      const error = ex as Error
      console.error(`Generate ${filename} Files [${name}] [${error.message}]`)
      return 1
    }
  })
  const succeeded = results.every((result) => result === 0)
  return succeeded ? 0 : 1
}
