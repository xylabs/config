import { cwd } from 'node:process'

import chalk from 'chalk'
import type { TsConfigCompilerOptions } from 'tsc-prog'
import { createProgramFromConfig } from 'tsc-prog'
import type { CompilerOptions } from 'typescript'
import ts, {
  DiagnosticCategory, formatDiagnosticsWithColorAndContext, getPreEmitDiagnostics, sys,
} from 'typescript'

import { getCompilerOptions } from './getCompilerOptions.ts'

export const packageCompileTsc = (
  platform: 'browser' | 'neutral' | 'node',
  entries: string[],
  srcDir: string = 'src',
  outDir: string = 'dist',
  compilerOptionsParam?: CompilerOptions,
  verbose: boolean = false,
): number => {
  const pkg = process.env.INIT_CWD ?? cwd()

  if (verbose) {
    console.log(chalk.cyan(`Validating code START: ${entries.length} files to ${outDir} from ${srcDir}`))
  }

  const configFilePath = ts.findConfigFile(
    './', // search path
    ts.sys.fileExists,
    'tsconfig.json',
  )

  if (configFilePath === undefined) {
    throw new Error('Could not find tsconfig.json')
  }

  const compilerOptions = {
    ...(getCompilerOptions({
      removeComments: false,
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: false,
    })),
    ...compilerOptionsParam,
    outDir: `${outDir}/${platform}`,
    emitDeclarationOnly: true,
    noEmit: false,
  } as TsConfigCompilerOptions

  console.log(chalk.cyan(`Validating Files: ${entries.length}`))
  if (verbose) {
    for (const entry of entries) {
      console.log(chalk.grey(`Validating: ${entry}`))
    }
  }

  try {
    if (entries.length > 0) {
      const program = createProgramFromConfig({
        configFilePath,
        basePath: pkg ?? cwd(),
        compilerOptions,
        files: entries.map(entry => `${srcDir}/${entry}`),
        include: [`${srcDir}/**/*.*`],
      })

      const diagnostics = getPreEmitDiagnostics(program)

      if (diagnostics.length > 0) {
        const formattedDiagnostics = formatDiagnosticsWithColorAndContext(
          diagnostics,
          {
            getCanonicalFileName: fileName => fileName,
            getCurrentDirectory: () => srcDir,
            getNewLine: () => sys.newLine,
          },
        )
        console.error(formattedDiagnostics)
      }

      program.emit()
      return diagnostics.reduce((acc, diag) => acc + (diag.category === DiagnosticCategory.Error ? 1 : 0), 0)
    }
    return 0
  } finally {
    if (verbose) {
      console.log(chalk.cyan(`Validating code FINISH: ${entries.length} files to ${outDir} from ${srcDir}`))
    }
  }
}
