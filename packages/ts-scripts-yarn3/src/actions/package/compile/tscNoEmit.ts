import { cwd } from 'process'
import { createProgramFromConfig, TsConfigCompilerOptions } from 'tsc-prog'
import { DiagnosticCategory } from 'typescript'

import { CompileParams } from './CompileParams'
import { getCompilerOptions } from './getCompilerOptions'

export const packageCompileTscNoEmit = (params?: CompileParams): number => {
  const pkg = process.env.INIT_CWD

  if (params?.verbose) {
    console.log(`Compiling with NoEmit TSC [${pkg}]`)
  }

  const result = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions: getCompilerOptions({
      declaration: true,
      declarationMap: true,
      esModuleInterop: true,
      noEmit: true,
      outDir: 'dist',
      skipLibCheck: true,
      sourceMap: true,
    }) as TsConfigCompilerOptions,
    exclude: ['dist', 'docs', '**/*.spec.*', 'src/**/spec/**/*'],
    include: ['src'],
  }).emit()

  return result.diagnostics.map((value) => value.category === DiagnosticCategory.Error).length
}