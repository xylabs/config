import chalk from 'chalk'

import { runSteps, ScriptStep } from '../lib'

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

export const compile = ({ verbose, target, pkg, incremental }: CompileParams) => {
  return pkg ? compilePackage({ pkg, target, verbose }) : compileAll({ incremental, target, verbose })
}

export const compilePackage = ({ verbose, target, pkg }: CompilePackageParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const cjsSteps: ScriptStep[] = target === 'cjs' ? [['yarn', ['workspace', pkg, 'run', 'package-compile-cjs', ...verboseOptions]]] : []

  const esmSteps: ScriptStep[] = target === 'esm' ? [['yarn', ['workspace', pkg, 'run', 'package-compile-esm', ...verboseOptions]]] : []

  const bothSteps: ScriptStep[] = !target ? [['yarn', ['workspace', pkg, 'run', 'package-compile', ...verboseOptions]]] : []

  return runSteps(`Compile [${pkg}]`, [...esmSteps, ...cjsSteps, ...bothSteps])
}

export const compileAll = ({ jobs, verbose, target, incremental }: CompileParams) => {
  const start = Date.now()
  const verboseOptions = verbose ? ['-v'] : []
  const incrementalOptions = incremental ? ['--since', '-ptA'] : ['-ptA']
  const jobsOptions = jobs ? ['-j', `${jobs}`] : []
  if (jobs) {
    console.log(chalk.blue(`Jobs set to [${jobs}]`))
  }
  const cjsSteps: ScriptStep[] =
    target === 'cjs'
      ? [['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-compile-cjs', ...verboseOptions]]]
      : []

  const esmSteps: ScriptStep[] =
    target === 'esm'
      ? [['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-compile-esm', ...verboseOptions]]]
      : []

  const bothSteps: ScriptStep[] = !target
    ? [['yarn', ['workspaces', 'foreach', ...incrementalOptions, ...jobsOptions, 'run', 'package-compile', ...verboseOptions]]]
    : []

  const result = runSteps(`Compile [All${incremental ? '-Incremental' : ''}]`, [...esmSteps, ...cjsSteps, ...bothSteps])
  console.log(`${chalk.gray('Compiled in')} [${chalk.magenta(((Date.now() - start) / 1000).toFixed(2))}] ${chalk.gray('seconds')}`)
  return result
}
