import { packageClean } from './clean.ts'
import { packageCompile } from './compile/index.ts'

export const packageRecompile = async () => {
  return await packageClean() || await packageCompile()
}
