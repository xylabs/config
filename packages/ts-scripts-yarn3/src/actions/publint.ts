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
  console.log(`publint: ${pkg}`)
  return pkg ? await publintPackage({ pkg, verbose }) : publintAll({ verbose })
}

export const publintPackage = ({ verbose, pkg }: PublintPackageParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  console.log(`publintPackage: ${pkg}`)
  return runStepsAsync(`Publint [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-publint', ...verboseOptions]]])
}

export const publintAll = ({ verbose }: PublintParams) => {
  console.log(`publintAll: ${verbose}`)
  const verboseOptions = verbose ? ['-v'] : []
  return runSteps('Publint', [['yarn', ['workspaces foreach -pA run package-publint', ...verboseOptions]]])
}
