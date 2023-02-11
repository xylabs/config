import chalk from 'chalk'

import { runStepsAsync, ScriptStep } from '../lib'

export interface CompileParams {
  incremental?: boolean
  jobs?: number
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export interface CompilePackageParams {
  pkg: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const compile = async ({ verbose, target, pkg, incremental }: CompileParams) => {
  return pkg ? await compilePackage({ pkg, target, verbose }) : await compileAll({ incremental, target, verbose })
}

export const compilePackage = ({ verbose, target, pkg }: CompilePackageParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const cjsSteps: ScriptStep[] = target === 'cjs' || !target ? [['yarn', ['workspace', pkg, 'run', 'package-compile-cjs', ...verboseOptions]]] : []

  const esmSteps: ScriptStep[] = target === 'esm' || !target ? [['yarn', ['workspace', pkg, 'run', 'package-compile-esm', ...verboseOptions]]] : []

  return runStepsAsync(`Compile [${pkg}]`, [...esmSteps, ...cjsSteps])
}

export const compileAll = async ({ jobs, verbose, target, incremental }: CompileParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['-v'] : []
  const incrementalOptions = incremental ? ['--since', '-ptA'] : ['-ptA']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }
  const cjsSteps: ScriptStep[] =
    target === 'cjs' || !target
      ? [['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-compile-cjs', ...verboseOptions]]]
      : []

  const esmSteps: ScriptStep[] =
    target === 'esm' || !target
      ? [['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-compile-esm', ...verboseOptions]]]
      : []

  const result = await runStepsAsync(`Compile [All${incremental ? '-Incremental' : ''}]`, [...esmSteps, ...cjsSteps])
  console.log(`${chalk.gray('Compiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
