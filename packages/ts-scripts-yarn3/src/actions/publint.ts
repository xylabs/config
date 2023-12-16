import { runSteps, runStepsAsync } from '../lib'

export interface PublintParams {
  pkg?: string
  verbose?: boolean
}

export interface PublintPackageParams {
  pkg: string
  verbose?: boolean
}

export const publint = async ({ verbose, pkg }: PublintParams) => {
  return pkg ? await publintPackage({ pkg, verbose }) : publintAll({ verbose })
}

export const publintPackage = ({ pkg }: PublintPackageParams) => {
  return runStepsAsync(`Publint [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-publint']]])
}

export const publintAll = ({ verbose }: PublintParams) => {
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  return runSteps('Publint', [['yarn', ['workspaces', 'foreach', '-pA', ...verboseOptions, 'run', 'package-publint']]])
}
