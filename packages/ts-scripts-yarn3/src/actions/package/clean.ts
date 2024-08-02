import { packageCleanOutputs } from './clean-outputs.ts'
import { packageCleanTypescript } from './clean-typescript.ts'

export const packageClean = async () => {
  return (await Promise.all([packageCleanOutputs(), packageCleanTypescript()])).reduce((prev, value) => prev + value, 0)
}
