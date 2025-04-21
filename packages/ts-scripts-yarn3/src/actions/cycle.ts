import { cruise, type ICruiseOptions } from 'dependency-cruiser'

import { runSteps } from '../lib/index.ts'

export interface CycleParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  verbose?: boolean
}

interface CyclePackageParams {
  pkg: string
  verbose?: boolean
}

export const cycle = async ({ verbose, pkg }: CycleParams = {}) => {
  return pkg
    ? cyclePackage({ pkg, verbose })
    : await cycleAll({ verbose })
}

export const cyclePackage = ({ pkg, verbose }: CyclePackageParams) => {
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  return runSteps(
    `Cycle [${pkg}]`,
    [['yarn', ['workspace', pkg, 'run', 'package-cycle', ...verboseOptions]]],
  )
}

export const cycleAll = async ({ verbose = false }: { verbose?: boolean }) => {
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
    outputType: verbose ? 'text' : 'err',
  }

  const target = '**/src'

  console.log(`Checking for circular dependencies in ${target}...`)

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
