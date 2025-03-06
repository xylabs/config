import { lint } from './lint.ts'

export const fix = async () => {
  return await lint({ fix: true })
}
