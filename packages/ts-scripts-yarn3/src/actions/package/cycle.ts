import type { ICruiseOptions } from 'dependency-cruiser'
import { cruise } from 'dependency-cruiser'

export const packageCycle = async ({ verbose = false }: { verbose: boolean }) => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name

  const cruiseOptions: ICruiseOptions = {
    ruleSet: {
      forbidden: [
        {
          name: 'no-cycles',
          severity: 'error',
          comment: 'This dependency creates a circular reference',
          from: {},
          to: { circular: true },
        },
      ],
    },
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: false,
    combinedDependencies: true,
    outputType: verbose ? 'text' : 'err',
  }

  const target = `${pkg}/src`

  const result = await cruise([target], cruiseOptions)
  if (result.output) {
    console.log(result.output)
  }

  if (result.exitCode === 0) {
    console.log(`${pkgName} ✅ No dependency violations`)
  } else {
    console.error(`${pkgName} ❌ Dependency violations found`)
  }
  return result.exitCode
}
