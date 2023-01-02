import { runSteps, ScriptStep } from '../lib'

export interface DepsParams {
  incremental?: boolean
  pkg?: string
}

export interface DepsPackageParams {
  pkg: string
}

export const deps = ({ pkg, incremental }: DepsParams) => {
  return pkg ? depsPackage({ pkg }) : depsAll({ incremental })
}

export const depsPackage = ({ pkg }: DepsPackageParams) => {
  const steps: ScriptStep[] = [['yarn', ['workspace', pkg, 'run', 'package-deps']]]

  return runSteps(`Deps [${pkg}]`, [...steps])
}

export const depsAll = ({ incremental }: DepsParams) => {
  const incrementalOptions = incremental ? ['--since', '-pA', '-j', '32'] : ['-pA', '-j', '32']
  const steps: ScriptStep[] = [['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-deps']]]

  return runSteps(`Deps [All${incremental ? '-Incremental' : ''}]`, [...steps])
}
