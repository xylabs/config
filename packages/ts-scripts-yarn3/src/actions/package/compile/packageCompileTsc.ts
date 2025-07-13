import { cwd } from 'node:process'

import chalk from 'chalk'
import type { TsConfigCompilerOptions } from 'tsc-prog'
import { createProgramFromConfig } from 'tsc-prog'
import type { CompilerOptions } from 'typescript'
import {
  DiagnosticCategory, formatDiagnosticsWithColorAndContext, getPreEmitDiagnostics, sys,
} from 'typescript'

import { getCompilerOptions } from './getCompilerOptions.ts'
import type { XyConfig } from './XyConfig.ts'

export const packageCompileTsc = (
  entries: string[],
  folder: string = 'src',
  config: XyConfig = {},
  compilerOptionsParam?: CompilerOptions,
  verbose: boolean = false,
): number => {
  const pkg = process.env.INIT_CWD ?? cwd()
  const resolvedVerbose = verbose ?? config?.verbose ?? false

  const compilerOptions = {
    ...(getCompilerOptions({
      removeComments: false,
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: false,
    })),
    ...compilerOptionsParam,
    outDir: 'build',
    emitDeclarationOnly: true,
    noEmit: false,
  } as TsConfigCompilerOptions

  console.log(chalk.green(`Validating Files: ${entries.length}`))
  if (resolvedVerbose) {
    for (const entry of entries) {
      console.log(chalk.grey(`Validating: ${entry}`))
    }
  }

  if (entries.length > 0) {
    const program = createProgramFromConfig({
      basePath: pkg ?? cwd(),
      compilerOptions,
      files: entries.map(entry => `${folder}/${entry}`),
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
  return 0
}
