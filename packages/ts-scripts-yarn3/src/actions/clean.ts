import { runStepsAsync } from '../lib/index.ts'

export interface CleanParams {
  pkg?: string
  verbose?: boolean
}

export interface CleanPackageParams {
  pkg: string
  verbose?: boolean
}

export const clean = async ({
  verbose, pkg,
}: CleanParams) => {
  return pkg
    ? await cleanPackage({
      pkg, verbose,
    })
    : cleanAll({ verbose })
}

export const cleanPackage = ({ pkg }: CleanPackageParams) => {
  return runStepsAsync(`Clean [${pkg}]`, [['yarn', ['workspace', pkg, 'run', 'package-clean']]])
}

export const cleanAll = ({ verbose }: CleanParams) => {
  const verboseOptions = verbose ? ['--verbose'] : ['--no-verbose']
  return runStepsAsync('Clean', [['yarn', ['workspaces foreach', '-pA', '--jobs 64', ...verboseOptions, 'run', 'package-clean']]])
}
