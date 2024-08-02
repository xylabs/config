import { packageClean } from './clean.ts'
import { packageCompile } from './compile/index.ts'

export const packageRecompile = async () => {
  return (await Promise.all([packageClean(), packageCompile()])).reduce((prev, value) => prev + value, 0)
}
