import chalk from 'chalk'

import { loadConfig } from '../../../lib/index.ts'
import { packageCompileTscTypes } from './packageCompileTscTypes.ts'
import type { XyConfig, XyTscConfig } from './XyConfig.ts'

export const packageCompileTypes = async (inConfig: XyConfig = {}): Promise<number> => {
  const pkg = process.env.INIT_CWD
  console.log(chalk.green(`Compiling Types ${pkg}`))
  const config = await loadConfig(inConfig)

  return packageCompileTscTypes(undefined, config as XyTscConfig)
}
