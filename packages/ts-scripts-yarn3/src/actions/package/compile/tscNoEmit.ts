import chalk from 'chalk'
import { cwd } from 'process'
import { createProgramFromConfig, TsConfigCompilerOptions } from 'tsc-prog'
import {
  CompilerOptions,
  DiagnosticCategory,
  FormatDiagnosticsHost,
  formatDiagnosticsWithColorAndContext,
  getLineAndCharacterOfPosition,
  getPreEmitDiagnostics,
  LineAndCharacter,
} from 'typescript'

import { CompileParams } from './CompileParams'
import { getCompilerOptions } from './getCompilerOptions'

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

  const compilerOptions = {
    ...getCompilerOptions({
      declaration: true,
      declarationMap: true,
      emitDeclarationOnly: true,
      esModuleInterop: true,
      outDir: 'dist',
      rootDir: 'src',
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: true,
    }),
    ...(compilerOptionsParam ?? {}),
  } as TsConfigCompilerOptions

  const program = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
    include: ['src'],
  })

  console.log(`noEmit-Program: [${pkg ?? cwd()}] ${JSON.stringify(program.getSourceFiles().length, null, 2)}`)

  const results = getPreEmitDiagnostics(program)

  results.forEach((diag) => {
    const lineAndChar: LineAndCharacter = diag.file ? getLineAndCharacterOfPosition(diag.file, diag.start ?? 0) : { character: 0, line: 0 }
    console.log(chalk.cyan(`${diag.file?.fileName}:${lineAndChar.line + 1}:${lineAndChar.character + 1}`))
    console.log(formatDiagnosticsWithColorAndContext([diag], formatHost))
  })

  return results.reduce((prev, diag) => (prev + diag.category === DiagnosticCategory.Error ? 1 : 0), 0)
}
