import chalk from 'chalk'
import { cosmiconfig } from 'cosmiconfig'
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader'
import deepmerge from 'deepmerge'

let config: Record<string, unknown>

export const loadConfig = async <T extends object>(params?: T): Promise<T> => {
  if (config) {
    return deepmerge(config, params ?? {}) as T
  }

  const cosmicConfigResult = await cosmiconfig('xy', { cache: true, loaders: { '.ts': TypeScriptLoader() } }).search()
  config = cosmicConfigResult?.config
  const configFilePath = cosmicConfigResult?.filepath
  if (configFilePath) {
    console.log(chalk.gray(`Loading config from ${configFilePath}`))
  }
  return deepmerge(config, params ?? {}) as T
}
