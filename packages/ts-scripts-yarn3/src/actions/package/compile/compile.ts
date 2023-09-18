import chalk from 'chalk'
// eslint-disable-next-line import/no-internal-modules
import merge from 'lodash/merge'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { packageCompileRollup } from './rollup'
import { packageCompileTsc } from './tsc'
import { packageCompileTsup } from './tsup'

export type PackageCompileMode = 'tsup' | 'tsc' | 'rollup'

export type PackageCompileParams = CompileParams & {
  compile?: {
    modes?: PackageCompileMode[]
  }
}

export const packageCompile = async (params?: PackageCompileParams): Promise<number> => {
  const pkg = process.env.INIT_CWD
  console.log(chalk.green(`Compiling ${pkg}`))
  const config = await loadConfig(params)
  const publint = config.compile?.publint ?? true

  const modes = config.compile?.modes ?? ['tsup']
  let modeIndex = 0
  let result: number = 0
  while (modeIndex < modes.length) {
    const mode = modes[modeIndex]
    switch (mode) {
      case 'rollup': {
        result += await packageCompileRollup(
          merge({}, params, {
            compile: {
              publint: false,
            },
          }),
        )
        break
      }
      case 'tsc': {
        result += await packageCompileTsc(
          merge({}, params, {
            compile: {
              publint: false,
            },
          }),
        )
        break
      }
      case 'tsup': {
        result += await packageCompileTsup(
          merge({}, params, {
            compile: {
              publint: false,
            },
          }),
        )
        break
      }
    }
    modeIndex++
  }
  return result + (publint ? await packagePublint(params) : 0)
}
