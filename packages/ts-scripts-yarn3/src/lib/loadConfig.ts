import chalk from 'chalk'
import { cosmiconfig } from 'cosmiconfig'

import merge from 'lodash/merge'

let config: Record<string, unknown>

export const loadConfig = async <T extends object>(params?: T): Promise<T> => {
  if (config) {
    return merge({}, config, params)
  }

  const cosmicConfigResult = await cosmiconfig('xy', { cache: true }).search()
  config = cosmicConfigResult?.config
  const configFilePath = cosmicConfigResult?.filepath
  if (configFilePath) {
    console.log(chalk.gray(`Loading config from ${configFilePath}`))
  }
  return merge({}, config, params)
}
