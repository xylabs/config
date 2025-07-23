import chalk from 'chalk'

import { loadConfig } from '../../../lib/index.ts'
import { packageCompileTsup } from './packageCompileTsup.ts'
import type { XyConfig } from './XyConfig.ts'

export const packageCompile = async (inConfig: XyConfig = {}): Promise<number> => {
  const pkg = process.env.INIT_CWD
  console.log(chalk.green(`Compiling ${pkg}`))
  const config = await loadConfig(inConfig)

  return await packageCompileTsup(config)
}
