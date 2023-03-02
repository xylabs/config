import { packageCleanOutputs } from './clean-outputs'
import { packageCleanTypescript } from './clean-typescript'

export const packageClean = () => {
  return packageCleanOutputs() + packageCleanTypescript()
}
