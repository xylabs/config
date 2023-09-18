import { cwd } from 'process'
import { build, BuildOptions } from 'tsc-prog'

import { loadConfig } from '../../../lib'
import { CompileParams } from './CompileParams'

export const packageCompileTscTypes = async (params?: CompileParams): Promise<number> => {
  const pkg = process.env.INIT_CWD
  const buildOptions: BuildOptions = {
    basePath: pkg ?? cwd(),
    compilerOptions: {
      declaration: true,
      declarationMap: true,
      emitDeclarationOnly: true,
      esModuleInterop: true,
      outDir: 'dist',
      skipLibCheck: true,
      sourceMap: true,
    },
    exclude: ['dist', 'docs', '*.spec.*', 'src/**/spec/**/*'],
    include: ['src'],
  }

  const config = await loadConfig(params)
  if (config.verbose) {
    console.log(`Compiling types with TSC [${pkg}]`)
  }

  build(buildOptions)
  return 0
}
