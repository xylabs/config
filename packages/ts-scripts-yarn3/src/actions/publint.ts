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

export const publintPackage = ({ verbose, pkg }: PublintPackageParams) => {
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  return runStepsAsync(`Publint [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-publint', ...verboseOptions]]])
}

export const publintAll = ({ verbose }: PublintParams) => {
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  return runSteps('Publint', [['yarn', ['workspaces foreach -pA run package-publint', ...verboseOptions]]])
}
