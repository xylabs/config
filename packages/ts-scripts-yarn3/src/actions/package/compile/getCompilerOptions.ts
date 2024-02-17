// eslint-disable-next-line import/no-internal-modules
import merge from 'lodash/merge'
import { CompilerOptions, findConfigFile, readConfigFile, sys } from 'typescript'

export const getCompilerOptionsJSONFollowExtends = (filename: string): CompilerOptions => {
  let opts = {}
  const config = readConfigFile(filename, sys.readFile).config
  if (config.extends) {
    const requirePath = require.resolve(config.extends)
    opts = getCompilerOptionsJSONFollowExtends(requirePath)
  }
  if (config?.error) {
    throw new Error(`getCompilerOptionsJSONFollowExtends failed ${JSON.stringify(config?.error?.messageText, null, 2)}`)
  }

  return { ...opts, ...config.compilerOptions }
}

export const getCompilerOptions = (options?: CompilerOptions, tsconfig: string = 'tsconfig.json'): CompilerOptions => {
  const configFileName = findConfigFile('./', sys.fileExists, tsconfig)
  const configFileCompilerOptions = configFileName ? getCompilerOptionsJSONFollowExtends(configFileName) : undefined

  return merge({}, configFileCompilerOptions, options)
}
