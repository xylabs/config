import chalk from 'chalk'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { CompileParams } from './CompileParams'
import { packageCompileTsc } from './packageCompileTsc'
import { packageCompileTsup } from './packageCompileTsup'

export const packageCompile = async (params: CompileParams = {}): Promise<number> => {
  const pkg = process.env.INIT_CWD
  console.log(chalk.green(`Compiling ${pkg}`))
  const config = await loadConfig(params)
  const publint = config.compile?.publint ?? false

  const mode = config.compile?.mode ?? 'tsup'
  let result: number = 0
  switch (mode) {
    case 'tsc': {
      result += packageCompileTsc(undefined, config)
      break
    }
    case 'tsup': {
      result += await packageCompileTsup(config)
      break
    }
  }
  return result + (publint ? await packagePublint(config) : 0)
}
