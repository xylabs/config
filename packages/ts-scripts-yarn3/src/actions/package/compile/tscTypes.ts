import { build, BuildOptions } from 'tsc-prog'
import { CompileParams } from "./CompileParams"
import { loadConfig } from "../../../lib"
import { getAllInputs } from "./inputs"
import { cwd } from 'process'


export const packageCompileTscTypes = async (params?: CompileParams): Promise<number> => {
  const pkg = process.env.INIT_CWD
  const buildOptions: BuildOptions = {
    basePath: pkg ?? cwd(),
    compilerOptions: {
      sourceMap: true,
      declaration: true,
      declarationMap: true,
      emitDeclarationOnly: true,
      esModuleInterop: true,
      outDir: 'dist'
    },
    include: ['src'],
    exclude: ['dist', 'docs']
  }

  const config = await loadConfig(params)
  if (config.verbose) {
    console.log(`Compiling types with TSC [${pkg}]`)
  }

  const fileNames = (await getAllInputs(config.compile?.depth)).map((fileName) => `src/${fileName}`)
  build(buildOptions)
  return 0
}