import chalk from 'chalk'
import { cosmiconfig } from 'cosmiconfig'

let config: Record<string, unknown>

export const loadConfig = async <T extends object>(params?: T): Promise<T> => {
  if (config) {
    return { ...config, ...params } as T
  }

  const cosmicConfigResult = await cosmiconfig('xy', { cache: true }).search()
  config = cosmicConfigResult?.config
  const configFilePath = cosmicConfigResult?.filepath
  if (configFilePath) {
    console.log(chalk.gray(`Loading config from ${configFilePath}`))
  }
  return { ...config, ...params } as T
}
