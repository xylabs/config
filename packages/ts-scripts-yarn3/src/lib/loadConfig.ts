import chalk from 'chalk'
import { cosmiconfig } from 'cosmiconfig'
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader'
import deepmerge from 'deepmerge'

let config: Record<string, unknown>

export const loadConfig = async <T extends object>(params?: T): Promise<T> => {
  if (config === undefined) {
    const cosmicConfigResult = await cosmiconfig('xy', { cache: true, loaders: { '.ts': TypeScriptLoader() } }).search()
    config = cosmicConfigResult?.config
    const configFilePath = cosmicConfigResult?.filepath
    if (configFilePath !== undefined) {
      console.log(chalk.green(`Loaded config from ${configFilePath}`))
      if (config.verbose) {
        console.log(chalk.gray(`${JSON.stringify(config, null, 2)}`))
      }
    }
  }
  return deepmerge(config, params ?? {}) as T
}
