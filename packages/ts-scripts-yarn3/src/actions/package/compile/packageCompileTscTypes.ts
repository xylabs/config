import { cwd } from 'node:process'

import type { TsConfigCompilerOptions } from 'tsc-prog'
import { createProgramFromConfig } from 'tsc-prog'
import type { CompilerOptions } from 'typescript'
import {
  DiagnosticCategory, formatDiagnosticsWithColorAndContext, getPreEmitDiagnostics, sys,
} from 'typescript'

import { buildEntries } from './buildEntries.ts'
import { getCompilerOptions } from './getCompilerOptions.ts'
import type { XyConfig } from './XyConfig.ts'

export const packageCompileTscTypes = (
  folder: string = 'src',
  config: XyConfig = {},
  compilerOptionsParam?: CompilerOptions,
): number => {
  const pkg = process.env.INIT_CWD ?? cwd()
  const verbose = config?.verbose ?? false

  if (verbose) {
    console.log(`Compiling types [${pkg}]`)
  }

  const compilerOptions = {
    ...(getCompilerOptions({
      emitDeclarationOnly: true,
      outDir: 'dist/types',
      removeComments: false,
      skipDefaultLibCheck: true,
      skipLibCheck: true,
      sourceMap: false,
    })),
    ...compilerOptionsParam,
    emitDeclarationOnly: true,
    noEmit: false,
  } as TsConfigCompilerOptions

  const validTsExt = ['.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts']

  // calling all here since the types do not get rolled up
  const files = buildEntries(folder, 'all', verbose).filter(file => validTsExt.find(ext => file.endsWith(ext)))

  const program = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
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
