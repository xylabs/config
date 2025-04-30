import { globSync } from 'glob'

export function findFilesByGlob(cwd: string, pattern: string) {
  return globSync(pattern, { cwd, absolute: true })
}
