import { findFilesByGlob } from './findFilesByGlob.ts'

export function findFiles(path: string) {
  const allSourceInclude = ['./src/**/*.{ts,tsx,mts,cts,js,mjs,cjs}']
  const allDistInclude = ['./dist/**/*.d.ts', './dist/**/*.{mjs,js,cjs}']
  const allConfigInclude = ['./*.config.{ts,mts,mjs,js}']
  const srcFiles = allSourceInclude.flatMap(pattern => findFilesByGlob(path, pattern))
  const distFiles = allDistInclude.flatMap(pattern => findFilesByGlob(path, pattern))
  const configFiles = allConfigInclude.flatMap(pattern => findFilesByGlob(path, pattern))

  return {
    srcFiles, distFiles, configFiles,
  }
}
