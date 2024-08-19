import { cwd } from 'node:process'

import chalk from 'chalk'
import type { TsConfigCompilerOptions } from 'tsc-prog'
import { createProgramFromConfig } from 'tsc-prog'
import type {
  CompilerOptions,
  FormatDiagnosticsHost,
  LineAndCharacter,
} from 'typescript'
import {
  DiagnosticCategory,
  formatDiagnosticsWithColorAndContext,
  getLineAndCharacterOfPosition,
  getPreEmitDiagnostics,
} from 'typescript'

import { packagePublint } from '../publint.ts'
import { getCompilerOptions } from './getCompilerOptions.ts'
import type { XyTscConfig } from './XyConfig.ts'

export const packageCompileTsc = async (noEmit?: boolean, config?: XyTscConfig, compilerOptionsParam?: CompilerOptions): Promise<number> => {
  const pkg = process.env.INIT_CWD ?? cwd()

  const publint = config?.publint ?? true
  const verbose = config?.verbose ?? false

  const formatHost: FormatDiagnosticsHost = {
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => pkg,
    getNewLine: () => '\n',
  }

  if (verbose) {
    console.log(`Compiling with NoEmit TSC [${pkg}]`)
  }

  const compilerOptions = {
    ...(getCompilerOptions({
      outDir: 'dist',
      removeComments: true,
      rootDir: 'src',
    })),
    ...compilerOptionsParam,
    ...(noEmit === undefined ? {} : { noEmit }),
  } as TsConfigCompilerOptions

  const program = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', '**/*.stories.*', 'src/**/spec/**/*'],
    include: ['src'],
  })

  const results = getPreEmitDiagnostics(program)

  for (const diag of results) {
    const lineAndChar: LineAndCharacter = diag.file
      ? getLineAndCharacterOfPosition(diag.file, diag.start ?? 0)
      : {
          character: 0, line: 0,
        }
    console.log(chalk.cyan(`${diag.file?.fileName}:${lineAndChar.line + 1}:${lineAndChar.character + 1}`))
    console.log(formatDiagnosticsWithColorAndContext([diag], formatHost))
  }

  // eslint-disable-next-line unicorn/no-array-reduce
  return results.reduce((prev, diag) => (prev + diag.category === DiagnosticCategory.Error ? 1 : 0), 0) || (publint ? await packagePublint() : 0)
}
