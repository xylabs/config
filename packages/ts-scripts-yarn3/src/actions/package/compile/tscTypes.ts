import { cwd } from 'process'
import { createProgramFromConfig, TsConfigCompilerOptions } from 'tsc-prog'
import { CompilerOptions, DiagnosticCategory } from 'typescript'

import { CompileParams } from './CompileParams'
import { copyTypeFiles } from './copyTypeFiles'
import { getCompilerOptions } from './getCompilerOptions'

export const packageCompileTscTypes = async (params?: CompileParams, compilerOptions?: CompilerOptions, generateMts = true): Promise<number> => {
  const pkg = process.env.INIT_CWD

  if (params?.verbose) {
    console.log(`Compiling types with TSC [${pkg}]`)
  }

  const result = createProgramFromConfig({
    basePath: pkg ?? cwd(),
    compilerOptions: getCompilerOptions({
      declaration: true,
      declarationMap: true,
      emitDeclarationOnly: true,
      esModuleInterop: true,
      outDir: 'dist',
      skipLibCheck: true,
      sourceMap: true,
      ...(compilerOptions ?? {}),
    }) as TsConfigCompilerOptions,
    configFilePath: 'tsconfig.json',
    exclude: ['dist', 'docs', '**/*.spec.*', 'src/**/spec/**/*'],
    include: ['src'],
  }).emit()

  const diagResults = result.diagnostics.map((value) => value.category === DiagnosticCategory.Error).length
  if (generateMts) {
    await copyTypeFiles()
  }
  return diagResults
}
