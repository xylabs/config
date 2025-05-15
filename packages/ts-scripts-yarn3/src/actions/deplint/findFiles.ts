import { findFilesByGlob } from './findFilesByGlob.ts'

export function findFiles(path: string) {
  const allSourceInclude = ['./src/**/*.{ts,tsx}']
  const allDistInclude = ['./dist/**/*.d.ts', './dist/**/*.{mjs,js,cjs}']
  const srcFiles = allSourceInclude.flatMap(pattern => findFilesByGlob(path, pattern))
  const distFiles = allDistInclude.flatMap(pattern => findFilesByGlob(path, pattern))

  return { srcFiles, distFiles }
}
