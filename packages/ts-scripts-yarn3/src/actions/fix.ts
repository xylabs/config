import type { LintParams } from './lint.ts'
import { lint } from './lint.ts'

export const fix = (params?: LintParams) => {
  return lint({ ...params, fix: true })
}
