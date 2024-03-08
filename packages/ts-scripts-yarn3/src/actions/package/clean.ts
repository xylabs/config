import { packageCleanOutputs } from './clean-outputs'
import { packageCleanTypescript } from './clean-typescript'

export const packageClean = async () => {
  return (await Promise.all([packageCleanOutputs(), packageCleanTypescript()])).reduce((prev, value) => prev + value, 0)
}
