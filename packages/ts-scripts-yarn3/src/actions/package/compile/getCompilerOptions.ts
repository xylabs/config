import { createRequire } from 'node:module'

import { merge } from 'lodash-es'
import { CompilerOptions, findConfigFile, readConfigFile, sys } from 'typescript'

export const getCompilerOptionsJSONFollowExtends = (filename: string): CompilerOptions => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let opts: any = {}
  const config = readConfigFile(filename, sys.readFile).config
  if (config.extends) {
    const require = createRequire(import.meta.url)
    opts = require(config.extends)
  }
  if (config?.error) {
    throw new Error(`getCompilerOptionsJSONFollowExtends failed ${JSON.stringify(config?.error?.messageText, null, 2)}`)
  }

  return { ...opts.compilerOptions, ...config.compilerOptions }
}

export const getCompilerOptions = async (options?: CompilerOptions, tsconfig: string = 'tsconfig.json'): Promise<CompilerOptions> => {
  const configFileName = findConfigFile('./', sys.fileExists, tsconfig)
  const configFileCompilerOptions = configFileName ? await getCompilerOptionsJSONFollowExtends(configFileName) : undefined

  return merge({}, configFileCompilerOptions, options)
}
