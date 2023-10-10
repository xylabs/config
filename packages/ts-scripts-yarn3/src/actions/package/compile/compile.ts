import chalk from 'chalk'

import { loadConfig } from '../../../lib'
import { packagePublint } from '../publint'
import { XyConfig, XyTscConfig, XyTsupConfig } from './CompileParams'
import { packageCompileTsc } from './packageCompileTsc'
import { packageCompileTsup } from './packageCompileTsup'

export const packageCompile = async (inConfig: XyConfig = {}): Promise<number> => {
  const pkg = process.env.INIT_CWD
  console.log(chalk.green(`Compiling ${pkg}`))
  const config = await loadConfig(inConfig)
  const publint = config.publint

  const mode = config.compile?.mode ?? 'tsup'
  let result: number = 0
  switch (mode) {
    case 'tsc': {
      result += await packageCompileTsc(undefined, config as XyTscConfig)
      break
    }
    case 'tsup': {
      result += await packageCompileTsup(config as XyTsupConfig)
      break
    }
  }
  return result + (publint ? await packagePublint(config) : 0)
}
