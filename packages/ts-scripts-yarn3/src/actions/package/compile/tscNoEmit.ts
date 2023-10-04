import chalk from 'chalk'
import { cwd } from 'process'
import {
  CompilerOptions,
  createProgram,
  CreateProgramOptions,
  DiagnosticCategory,
  FormatDiagnosticsHost,
  formatDiagnosticsWithColorAndContext,
  getLineAndCharacterOfPosition,
  getPreEmitDiagnostics,
  LineAndCharacter,
} from 'typescript'

import { CompileParams } from './CompileParams'
import { getCompilerOptions } from './getCompilerOptions'
import { getAllInputs2 } from './inputs'

export const packageCompileTscNoEmit = (params?: CompileParams, compilerOptionsParam?: CompilerOptions): number => {
  const pkg = process.env.INIT_CWD ?? cwd()

  const formatHost: FormatDiagnosticsHost = {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => pkg,
    getNewLine: () => '\n',
  }

  if (params?.verbose) {
    console.log(`Compiling with NoEmit TSC [${pkg}]`)
  }

  const options: CompilerOptions = {
    ...getCompilerOptions({
      alwaysStrict: true,
      baseUrl: pkg,
      declaration: false,
      declarationMap: false,
      emitDeclarationOnly: false,
      noEmit: true,
      outDir: 'dist',
      rootDir: 'src',
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: false,
      strict: true,
      strictBindCallApply: true,
      strictFunctionTypes: true,
      strictNullChecks: true,
      strictPropertyInitialization: true,
    }),
    ...(compilerOptionsParam ?? {}),
  }

  delete options['moduleResolution']

  const rootNames = getAllInputs2(options.rootDir ?? 'src')

  const programOptions: CreateProgramOptions = {
    options,
    rootNames,
  }

  const program = createProgram(programOptions)

  console.log(`noEmit-Program: [${pkg ?? cwd()}] ${JSON.stringify(program.getSourceFiles().length, null, 2)}`)

  const results = getPreEmitDiagnostics(program)

  results.forEach((diag) => {
    const lineAndChar: LineAndCharacter = diag.file ? getLineAndCharacterOfPosition(diag.file, diag.start ?? 0) : { character: 0, line: 0 }
    console.log(chalk.cyan(`${pkg}/${diag.file?.fileName}:${lineAndChar.line + 1}:${lineAndChar.character + 1}`))
    console.log(formatDiagnosticsWithColorAndContext([diag], formatHost))
  })

  return results.reduce((prev, diag) => (prev + diag.category === DiagnosticCategory.Error ? 1 : 0), 0)
}
