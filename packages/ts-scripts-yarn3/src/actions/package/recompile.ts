import { packageClean } from './clean'
import { packageCompile } from './compile'

export const packageRecompile = async () => {
  return (await Promise.all([packageClean(), packageCompile()])).reduce((prev, value) => prev + value, 0)
}
