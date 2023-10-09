import chalk from 'chalk'
import { cwd } from 'process'
import { createProgramFromConfig, TsConfigCompilerOptions } from 'tsc-prog'
import { CompilerOptions, DiagnosticCategory } from 'typescript'

import { buildEntries } from './buildEntries'
import { CompileParams } from './CompileParams'
import { copyTypeFiles } from './copyTypeFiles'
import { getCompilerOptions } from './getCompilerOptions'

export const packageCompileTscTypes = async (
  folder: string = 'src',
  { compile, verbose }: CompileParams = {},
  compilerOptionsParam?: CompilerOptions,
  generateMts = true,
): Promise<number> => {
  const pkg = process.env.INIT_CWD ?? cwd()

  if (verbose) {
    console.log(`Compiling types with TSC [${pkg}]`)
  }

  const compilerOptions = {
    ...getCompilerOptions({
      declaration: true,
      declarationMap: true,
      emitDeclarationOnly: true,
      outDir: 'dist',
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: true,
    }),
    ...(compilerOptionsParam ?? {}),
  } as TsConfigCompilerOptions

  const files = buildEntries(folder, compile?.entryMode)

  const result = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
    files,
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
