import { cwd } from 'node:process'

import chalk from 'chalk'
import type { TsConfigCompilerOptions } from 'tsc-prog'
import { createProgramFromConfig } from 'tsc-prog'
import type { CompilerOptions } from 'typescript'
import {
  DiagnosticCategory, formatDiagnosticsWithColorAndContext, getPreEmitDiagnostics, sys,
} from 'typescript'

import { buildEntries } from './buildEntries.ts'
import { getCompilerOptions } from './getCompilerOptions.ts'
import type { XyConfig } from './XyConfig.ts'

export const packageCompileTsc = (
  folder: string = 'src',
  config: XyConfig = {},
  compilerOptionsParam?: CompilerOptions,
): number => {
  const pkg = process.env.INIT_CWD ?? cwd()
  const verbose = config?.verbose ?? false

  const compilerOptions = {
    ...(getCompilerOptions({
      outDir: 'dist/types',
      removeComments: false,
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: false,
    })),
    ...compilerOptionsParam,
    emitDeclarationOnly: false,
    noEmit: true,
  } as TsConfigCompilerOptions

  const validTsExt = ['.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts']

  // calling all here since the types do not get rolled up
  const files = buildEntries(folder, 'all', verbose).filter(file => validTsExt.find(ext => file.endsWith(ext)))

  console.log(chalk.green(`Compiling Files ${pkg}: ${files.length}`))

  const program = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs'],
    files,
  })

  const diagnostics = getPreEmitDiagnostics(program)

  if (diagnostics.length > 0) {
    const formattedDiagnostics = formatDiagnosticsWithColorAndContext(
      diagnostics,
      {
        getCanonicalFileName: fileName => fileName,
        getCurrentDirectory: () => folder,
        getNewLine: () => sys.newLine,
      },
    )
    console.error(formattedDiagnostics)
  }

  program.emit()
  return diagnostics.reduce((acc, diag) => acc + (diag.category === DiagnosticCategory.Error ? 1 : 0), 0)
}
