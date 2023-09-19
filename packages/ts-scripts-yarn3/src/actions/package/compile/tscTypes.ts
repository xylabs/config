import { cwd } from 'process'
import { createProgramFromConfig, TsConfigCompilerOptions } from 'tsc-prog'
import { DiagnosticCategory } from 'typescript'

import { loadConfig } from '../../../lib'
import { CompileParams } from './CompileParams'
import { copyTypeFiles } from './copyTypeFiles'
import { getCompilerOptions } from './getCompilerOptions'

export const packageCompileTscTypes = async (params?: CompileParams): Promise<number> => {
  const pkg = process.env.INIT_CWD

  const config = await loadConfig(params)
  if (config.verbose) {
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
    }) as TsConfigCompilerOptions,
    configFilePath: 'tsconfig.json',
    exclude: ['dist', 'docs', '**/*.spec.*', 'src/**/spec/**/*'],
    include: ['src'],
  }).emit()

  await copyTypeFiles()
  return result.diagnostics.map((value) => value.category === DiagnosticCategory.Error).length
}
