import ts, { CompilerOptions, readConfigFile, sys, getPreEmitDiagnostics, parseJsonConfigFileContent, getLineAndCharacterOfPosition, flattenDiagnosticMessageText, createProgram, convertCompilerOptionsFromJson, Diagnostic, findConfigFile } from "typescript"
import { CompileParams } from "./CompileParams"
import { loadConfig } from "../../../lib"
import { getAllInputs } from "./inputs"
import merge from 'lodash/merge'
import chalk from "chalk"

export type PackageCompileTscParams = Partial<CompileParams & {
  compile?: {
    tsc?: {
      tsconfig?: string
      compilerOptions?: CompilerOptions
    }
  }
}>

const getCompilerOptionsJSONFollowExtends = (filename: string): Record<string, any> => {
  let opts = {};
  const config = readConfigFile(filename, ts.sys.readFile).config;
  if (config.extends) {
    const requirePath = require.resolve(config.extends);
    opts = getCompilerOptionsJSONFollowExtends(requirePath);
  }
  if (config?.error) {
    throw Error(`getCompilerOptionsJSONFollowExtends failed ${JSON.stringify(config?.error?.messageText, null, 2)}`)
  }
  
  return config.compilerOptions
}

const getCompilerOptions = (options?: CompilerOptions, tsconfig: string = "tsconfig.json"): CompilerOptions => {
  const configFileName = findConfigFile(
    "./",
    ts.sys.fileExists,
    tsconfig
  )
  const configFileCompilerOptions = configFileName ? getCompilerOptionsJSONFollowExtends(configFileName) : undefined

  return merge({}, configFileCompilerOptions, options)
}

const getConfigFile = (options?: CompilerOptions, tsconfig: string = "tsconfig.json") => {
  const configFileName = findConfigFile(
    "./",
    ts.sys.fileExists,
    tsconfig
  )
  return {...(configFileName ? readConfigFile(configFileName, sys.readFile).config : {}), compilerOptions: getCompilerOptions(options)}
}

const compile = (fileNames: string[], optionsParam: CompilerOptions) => {
  console.log(chalk.blue(`compile`))
  const {moduleResolution, ...options} = optionsParam
  console.log(chalk.magenta(`options: ${JSON.stringify(options, null, 2)}`))
  const program = createProgram(fileNames, options)
  console.log(chalk.blue(`createProgram`))
  const emitResult = program.emit()
  console.log(chalk.blue(`emit`))

  const allDiagnostics: Diagnostic[] = getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  const errorDiagnostics = allDiagnostics.filter((diagnostic) => diagnostic.category === 1)

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
      let message = flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    } else {
      console.log(flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
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
    sourceMap: true,
    declaration: true,
    declarationMap: true,
    rootDir: 'src',
    outDir: 'dist',
  }
  const compilerOptions = merge({}, defaultCompilerOptions, params?.compile?.tsc?.compilerOptions)
  const config = await loadConfig(params)
  if (config.verbose) {
    console.log(`Compiling with TSC`)
  }

  const fileNames = (await getAllInputs(config.compile?.depth)).map((fileName) => `src/${fileName}`)
  const configFile = getConfigFile(compilerOptions)
  return compile(fileNames, configFile.compilerOptions)
}