import chalk from 'chalk'

import { loadConfig } from '../../../lib/index.ts'
import { packagePublint } from '../publint.ts'
import { packageCompileTsc } from './packageCompileTsc.ts'
import { packageCompileTsup } from './packageCompileTsup.ts'
import type {
  XyConfig, XyTscConfig, XyTsupConfig,
} from './XyConfig.ts'

export const packageCompile = async (inConfig: XyConfig = {}, types?: 'tsc' | 'tsup'): Promise<number> => {
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
      result += await packageCompileTsup(config as XyTsupConfig, types)
      break
    }
  }
  return result + (publint ? await packagePublint(config) : 0)
}
