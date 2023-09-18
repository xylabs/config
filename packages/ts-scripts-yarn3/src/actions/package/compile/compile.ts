import { packageCompileTsup } from './tsup'
import { CompileParams } from './CompileParams'
import { packageCompileTsc } from './tsc'
import { packageCompileRollup } from './rollup'
import { packagePublint } from '../publint'
import { loadConfig } from '../../../lib'
import merge from 'lodash/merge'
import chalk from 'chalk'

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

  const modes = config.compile?.modes ?? ['tsup']
  let modeIndex = 0
  while (modeIndex < modes.length) {
    const mode = modes[modeIndex]
    switch (mode) {
      case 'rollup': {
        const result = packageCompileRollup(merge({}, params, {compile: {
          publint: false
        }}))
        if (result) {
          return result
        }
        break
      }
      case 'tsc': {
        const result = packageCompileTsc(merge({}, params, {compile: {
          publint: false
        }}))
        if (result) {
          return result
        }
        break
      }
      case 'tsup': {
        const result = packageCompileTsup(merge({}, params, {compile: {
          publint: false
        }}))
        if (result) {
          return result
        }
        break
      }
    }
    modeIndex++
  }
  return (config.compile?.publint ? await packagePublint(params) : 0)
}
