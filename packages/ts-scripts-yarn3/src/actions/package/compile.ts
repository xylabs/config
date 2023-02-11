import { packageCompileCjs } from './compile-cjs'
import { packageCompileEsm } from './compile-esm'

export const packageCompile = async () => {
  return (await Promise.all([packageCompileEsm(), packageCompileCjs()])).reduce((prev, value) => prev + value, 0)
}
