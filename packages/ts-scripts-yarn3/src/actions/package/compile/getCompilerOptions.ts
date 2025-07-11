import { cwd } from 'node:process'

import deepmerge from 'deepmerge'
import { getTsconfig } from 'get-tsconfig'
import type { CompilerOptions } from 'typescript'

export const getCompilerOptions = (options: CompilerOptions = {}, fileName: string = 'tsconfig.json'): CompilerOptions => {
  const resolvedTsConfigCompilerOptions = getTsconfig(cwd(), fileName)?.config?.compilerOptions ?? {}

  return deepmerge(resolvedTsConfigCompilerOptions, options)
}
