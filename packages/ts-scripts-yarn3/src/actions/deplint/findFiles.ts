import { findFilesByGlob } from './findFilesByGlob.ts'

export function findFiles(path: string) {
  const allSourceInclude = ['./src/**/*.{ts,tsx}']
  const allDistInclude = ['./dist/**/*.d.ts']
  const prodExcludeEndswith = ['.spec.ts', '.stories.tsx']
  const prodExcludeIncludes = ['/spec/', '/stories/', '/scripts/']
  const allSourceFiles = allSourceInclude.flatMap(pattern => findFilesByGlob(path, pattern))
  const allDistFiles = allDistInclude.flatMap(pattern => findFilesByGlob(path, pattern))

  const prodSourceFiles = allSourceFiles.filter(file => !prodExcludeEndswith.some(ext => file.endsWith(ext))
    && !prodExcludeIncludes.some(excl => file.includes(excl)))

  const prodDistFiles = allDistFiles.filter(file => !prodExcludeEndswith.some(ext => file.endsWith(ext))
    && !prodExcludeIncludes.some(excl => file.includes(excl)))

  const devSourceFiles = allSourceFiles.filter(file => !prodSourceFiles.includes(file))
  return {
    allSourceFiles, prodSourceFiles, devSourceFiles, prodDistFiles,
  }
}
