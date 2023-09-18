import chalk from 'chalk'
import { cosmiconfig } from 'cosmiconfig'
// eslint-disable-next-line import/no-internal-modules
import merge from 'lodash/merge'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let config: Record<string, any>

export const loadConfig = async <T extends object>(params?: T): Promise<T> => {
  if (config) {
    return merge({}, config, params)
  }

  const cosmicConfigResult = await cosmiconfig('xy').search()
  config = cosmicConfigResult?.config
  const configFilePath = cosmicConfigResult?.filepath
  if (configFilePath) {
    console.log(chalk.gray(`Loading config from ${configFilePath}`))
  }
  return merge({}, config, params)
}
