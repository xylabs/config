import { cwd } from 'process'
import { createProgramFromConfig, TsConfigCompilerOptions } from 'tsc-prog'
import { CompilerOptions, DiagnosticCategory } from 'typescript'

import { CompileParams } from './CompileParams'
import { copyTypeFiles } from './copyTypeFiles'
import { getCompilerOptions } from './getCompilerOptions'
import chalk from 'chalk'

export const packageCompileTscTypes = async (params?: CompileParams, compilerOptionsParam?: CompilerOptions, generateMts = true): Promise<number> => {
  const pkg = process.env.INIT_CWD

  if (params?.verbose) {
    console.log(`Compiling types with TSC [${pkg}]`)
  }

  const compilerOptions = {...getCompilerOptions({
    declaration: true,
    declarationMap: true,
    emitDeclarationOnly: true,
    esModuleInterop: true,
    outDir: 'dist',
    skipLibCheck: true,
    sourceMap: true,
  }),
  ...(compilerOptionsParam ?? {}),} as TsConfigCompilerOptions

  const result = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
    include: ['src'],
  }).emit()

  const diagResults = result.diagnostics.map((value) => value.category === DiagnosticCategory.Error).length
  result.diagnostics.forEach((diag) => {
    switch (diag.category) {
      case DiagnosticCategory.Error:
        console.error(chalk.red(diag.messageText))
        console.error(chalk.grey(JSON.stringify(diag)))
        break
      case DiagnosticCategory.Warning:
        console.error(chalk.yellow(diag.messageText))
        console.error(chalk.grey(JSON.stringify(diag)))
        break
      case DiagnosticCategory.Suggestion:
        console.error(chalk.white(diag.messageText))
        console.error(chalk.grey(JSON.stringify(diag)))
        break
    }
  })
  if (generateMts) {
    await copyTypeFiles(compilerOptions)
  }
  return diagResults
}
