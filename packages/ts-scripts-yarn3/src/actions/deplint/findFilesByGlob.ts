import { globSync } from 'glob'

export function findFilesByGlob(cwd: string, pattern: string, ignore?: string[]) {
  return globSync(pattern, {
    cwd, absolute: true, ignore, nodir: true,
  })
}
