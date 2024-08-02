import { createRequire } from 'node:module'

import { merge } from 'lodash-es'
import { TsConfig } from 'tsc-prog'
import { CompilerOptions, findConfigFile, readConfigFile, sys } from 'typescript'

const getNested = (config: TsConfig): CompilerOptions => {
  if (config.extends) {
    const require = createRequire(import.meta.url)
    const opts = require(config.extends)
    return { ...getNested(opts), ...config.compilerOptions } as CompilerOptions
  }

  return config.compilerOptions as CompilerOptions
}

export const getCompilerOptionsJSONFollowExtends = (filename: string): CompilerOptions => {
  const config = readConfigFile(filename, sys.readFile).config
  return getNested(config)
}

export const getCompilerOptions = (options?: CompilerOptions, tsconfig: string = 'tsconfig.json'): CompilerOptions => {
  const configFileName = findConfigFile('./', sys.fileExists, tsconfig)
  const configFileCompilerOptions = configFileName ? getCompilerOptionsJSONFollowExtends(configFileName) : undefined

  return merge({}, configFileCompilerOptions, options)
}
