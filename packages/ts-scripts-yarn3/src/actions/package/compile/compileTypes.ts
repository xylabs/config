import { loadConfig } from '../../../lib/index.ts'
import { packageCompileTscTypes } from './packageCompileTscTypes.ts'
import type { XyConfig, XyTscConfig } from './XyConfig.ts'

export const packageCompileTypes = async (inConfig: XyConfig = {}): Promise<number> => {
  const config = await loadConfig(inConfig)

  return packageCompileTscTypes(undefined, config as XyTscConfig)
}
