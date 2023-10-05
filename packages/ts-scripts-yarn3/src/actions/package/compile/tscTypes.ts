import chalk from 'chalk'
import { cwd } from 'process'
import { createProgramFromConfig, TsConfigCompilerOptions } from 'tsc-prog'
import { CompilerOptions, DiagnosticCategory } from 'typescript'

import { CompileParams } from './CompileParams'
import { copyTypeFiles } from './copyTypeFiles'
import { getCompilerOptions } from './getCompilerOptions'

export const packageCompileTscTypes = async (params?: CompileParams, compilerOptionsParam?: CompilerOptions, generateMts = true): Promise<number> => {
  const pkg = process.env.INIT_CWD ?? cwd()

  if (params?.verbose) {
    console.log(`Compiling types with TSC [${pkg}]`)
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

  const result = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
    include: ['src'],
  }).emit()

  const diagResults = result.diagnostics.length
  result.diagnostics.forEach((diag) => {
    switch (diag.category) {
      case DiagnosticCategory.Error:
        console.error(chalk.red(diag.messageText))
        console.error(chalk.grey(pkg))
        console.error(chalk.blue(diag.file?.fileName))
        break
      case DiagnosticCategory.Warning:
        console.error(chalk.yellow(diag.messageText))
        console.error(chalk.grey(pkg))
        console.error(chalk.blue(diag.file?.fileName))
        break
      case DiagnosticCategory.Suggestion:
        console.error(chalk.white(diag.messageText))
        console.error(chalk.grey(pkg))
        console.error(chalk.blue(diag.file?.fileName))
        break
    }
  })
  if (generateMts) {
    await copyTypeFiles(compilerOptions)
  }
  return diagResults
}
