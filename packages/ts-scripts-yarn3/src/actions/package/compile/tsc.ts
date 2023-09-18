import chalk from 'chalk'
// eslint-disable-next-line import/no-internal-modules
import merge from 'lodash/merge'
import {
  CompilerOptions,
  createProgram,
  Diagnostic,
  findConfigFile,
  flattenDiagnosticMessageText,
  getLineAndCharacterOfPosition,
  getPreEmitDiagnostics,
  readConfigFile,
  sys,
} from 'typescript'

import { loadConfig } from '../../../lib'
import { CompileParams } from './CompileParams'
import { getAllInputs } from './inputs'

export type PackageCompileTscParams = Partial<
  CompileParams & {
    compile?: {
      tsc?: {
        compilerOptions?: CompilerOptions
        tsconfig?: string
      }
    }
  }
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCompilerOptionsJSONFollowExtends = (filename: string): CompilerOptions => {
  let opts = {}
  const config = readConfigFile(filename, sys.readFile).config
  if (config.extends) {
    const requirePath = require.resolve(config.extends)
    opts = getCompilerOptionsJSONFollowExtends(requirePath)
  }
  if (config?.error) {
    throw Error(`getCompilerOptionsJSONFollowExtends failed ${JSON.stringify(config?.error?.messageText, null, 2)}`)
  }

  return { ...opts, ...config.compilerOptions }
}

const getCompilerOptions = (options?: CompilerOptions, tsconfig: string = 'tsconfig.json'): CompilerOptions => {
  const configFileName = findConfigFile('./', sys.fileExists, tsconfig)
  const configFileCompilerOptions = configFileName ? getCompilerOptionsJSONFollowExtends(configFileName) : undefined

  return merge({}, configFileCompilerOptions, options)
}

const getConfigFile = (options?: CompilerOptions, tsconfig: string = 'tsconfig.json') => {
  const configFileName = findConfigFile('./', sys.fileExists, tsconfig)
  return { ...(configFileName ? readConfigFile(configFileName, sys.readFile).config : {}), compilerOptions: getCompilerOptions(options) }
}

const compile = (fileNames: string[], options: CompilerOptions) => {
  console.log(chalk.blue('compile'))
  console.log(chalk.magenta(`options: ${JSON.stringify(options, null, 2)}`))
  const program = createProgram(fileNames, options)
  console.log(chalk.blue('createProgram'))
  const emitResult = program.emit()
  console.log(chalk.blue('emit'))

  const allDiagnostics: Diagnostic[] = getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  const errorDiagnostics = allDiagnostics.filter((diagnostic) => diagnostic.category === 1)

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
      const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    } else {
      console.log(flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })

  if (errorDiagnostics.length) {
    console.log(chalk.red(`Errors: ${errorDiagnostics.length}`))
    process.exit(errorDiagnostics.length)
  }

  return errorDiagnostics.length
}

export const packageCompileTsc = async (params?: PackageCompileTscParams): Promise<number> => {
  const defaultCompilerOptions: CompilerOptions = {
    declaration: true,
    declarationMap: true,
    outDir: 'dist',
    rootDir: 'src',
    sourceMap: true,
  }
  const compilerOptions = merge({}, defaultCompilerOptions, params?.compile?.tsc?.compilerOptions)
  const config = await loadConfig(params)
  if (config.verbose) {
    console.log('Compiling with TSC')
  }

  const fileNames = (await getAllInputs(config.compile?.depth)).map((fileName) => `src/${fileName}`)
  const configFile = getConfigFile(compilerOptions)
  return compile(fileNames, configFile.compilerOptions)
}
