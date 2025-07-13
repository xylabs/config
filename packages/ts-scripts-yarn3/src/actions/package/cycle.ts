import type { ICruiseOptions } from 'dependency-cruiser'
import { cruise } from 'dependency-cruiser'

export const packageCycle = async () => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name

  const cruiseOptions: ICruiseOptions = {
    ruleSet: {
      forbidden: [
        {
          name: 'no-circular',
          severity: 'error',
          comment: 'This dependency creates a circular reference',
          from: {},
          to: { circular: true },
        },
      ],
    },
    exclude: 'node_modules|packages/.*/packages',
    validate: true,
    doNotFollow: { path: 'node_modules|packages/.*/packages' },
    tsPreCompilationDeps: false,
    combinedDependencies: true,
    outputType: 'err',
  }

  const target = `${pkg}/src`

  console.log(`Checking for circular dependencies in ${target}...`)

  const result = await cruise([target], cruiseOptions)
  console.log(result.output)

  if (result.exitCode === 0) {
    console.log(`${pkgName} ✅ No dependency violations`)
  } else {
    console.error(`${pkgName} ❌ Dependency violations found`)
  }
  return result.exitCode
}
