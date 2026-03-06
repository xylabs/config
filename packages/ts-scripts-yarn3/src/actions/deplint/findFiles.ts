import fs from 'node:fs'

import { findFilesByGlob } from './findFilesByGlob.ts'

const codeExtensions = '*.{ts,tsx,mts,cts,js,mjs,cjs}'

function getWorkspaceIgnores(location: string): string[] {
  try {
    const raw = fs.readFileSync(`${location}/package.json`, 'utf8')
    const pkg = JSON.parse(raw)
    return pkg.workspaces ?? []
  } catch {
    return []
  }
}

export function findFiles(location: string) {
  const workspaceIgnores = getWorkspaceIgnores(location).map(w => `${w}/**`)
  const ignore = ['**/node_modules/**', 'dist/**', ...workspaceIgnores]
  const allFiles = findFilesByGlob(location, `./**/${codeExtensions}`, ignore)
  const distFiles = [
    ...findFilesByGlob(location, './dist/**/*.d.ts'),
    ...findFilesByGlob(location, `./dist/**/${codeExtensions}`),
  ]

  return { allFiles, distFiles }
}
