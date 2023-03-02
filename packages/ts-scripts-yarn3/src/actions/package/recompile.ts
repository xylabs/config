import { packageClean } from './clean'
import { packageCompileCjs } from './compile-cjs'
import { packageCompileEsm } from './compile-esm'

export const packageRecompile = async () => {
  return (await Promise.all([packageClean(), packageCompileEsm(), packageCompileCjs()])).reduce((prev, value) => prev + value, 0)
}
