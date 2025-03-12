import chalk from 'chalk'

import { loadConfig } from '../../../lib/index.ts'
import { packagePublint } from '../publint.ts'
import { packageCompileTypes } from './compileTypes.ts'
import { packageCompileTsup } from './packageCompileTsup.ts'
import type { XyConfig } from './XyConfig.ts'

export const packageCompile = async (inConfig: XyConfig = {}): Promise<number> => {
  const pkg = process.env.INIT_CWD
  console.log(chalk.green(`Compiling ${pkg}`))
  const config = await loadConfig(inConfig)
  const publint = config.publint

  const tscResults = await packageCompileTypes(config)

  if (tscResults > 0) {
    return tscResults
  }

  const tsupResults = await packageCompileTsup(config)

  if (tsupResults > 0) {
    return tsupResults
  }

  return (publint ? await packagePublint(config) : 0)
}
