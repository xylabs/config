import { runSteps, runStepsAsync } from '../lib'
import { cleanDocs } from './clean-docs'
import { cleanESLint } from './clean-eslint'

export interface CleanParams {
  pkg?: string
  verbose?: boolean
}

export interface CleanPackageParams {
  pkg: string
  verbose?: boolean
}

export const clean = async ({ verbose, pkg }: CleanParams) => {
  return pkg ? await cleanPackage({ pkg, verbose }) : cleanAll({ verbose })
}

export const cleanPackage = ({ verbose, pkg }: CleanPackageParams) => {
  const verboseOptions = verbose ? ['-v'] : []

  return runStepsAsync(`Clean [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-clean', ...verboseOptions]]])
}

export const cleanAll = ({ verbose }: CleanParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  return cleanESLint() + cleanDocs() + runSteps('Clean', [['yarn', ['workspaces foreach -pA run package-clean', ...verboseOptions]]])
}
