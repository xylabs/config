import { cwd } from 'node:process'

import chalk from 'chalk'
import type { TsConfigCompilerOptions } from 'tsc-prog'
import { createProgramFromConfig } from 'tsc-prog'
import type { CompilerOptions } from 'typescript'
import { DiagnosticCategory } from 'typescript'

import { buildEntries } from './buildEntries.ts'
import { getCompilerOptions } from './getCompilerOptions.ts'
import type { XyConfig } from './XyConfig.ts'

export const packageCompileTscTypes = (
  folder: string = 'src',
  { verbose }: XyConfig = {},
  compilerOptionsParam?: CompilerOptions,
): number => {
  const pkg = process.env.INIT_CWD ?? cwd()

  if (verbose) {
    console.log(`Compiling types with TSC [${pkg}]`)
  }

  const compilerOptions = {
    ...(getCompilerOptions({
      declaration: true,
      emitDeclarationOnly: true,
      outDir: 'dist',
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: true,
    })),
    ...compilerOptionsParam,
  } as TsConfigCompilerOptions

  // calling all here since the types do not get rolled up
  const files = buildEntries(folder, 'all')

  const result = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
    files,
  }).emit()

  const diagResults = result.diagnostics.length
  for (const diag of result.diagnostics) {
    switch (diag.category) {
      case DiagnosticCategory.Error: {
        console.error(chalk.red(diag.messageText))
        console.error(chalk.grey(pkg))
        console.error(chalk.blue(diag.file?.fileName))
        break
      }
      case DiagnosticCategory.Warning: {
        console.error(chalk.yellow(diag.messageText))
        console.error(chalk.grey(pkg))
        console.error(chalk.blue(diag.file?.fileName))
        break
      }
      case DiagnosticCategory.Suggestion: {
        console.error(chalk.white(diag.messageText))
        console.error(chalk.grey(pkg))
        console.error(chalk.blue(diag.file?.fileName))
        break
      }
    }
  }
  return diagResults
}
