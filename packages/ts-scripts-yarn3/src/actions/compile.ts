import { runSteps, ScriptStep } from '../lib'

export interface CompileParams {
  target?: 'esm' | 'cjs'
  incremental?: boolean
  pkg?: string
}

export interface CompilePackageParams {
  target?: 'esm' | 'cjs'
  pkg: string
}

export const compile = ({ target, pkg, incremental }: CompileParams) => {
  return pkg ? compilePackage({ pkg, target }) : compileAll({ incremental, target })
}

export const compilePackage = ({ target, pkg }: CompilePackageParams) => {
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', pkg, '-t', 'cjs']],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-cjs']],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', pkg, '-t', 'esm']],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-esm']],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'esm']],
        ]
      : []

  return runSteps(`Compile [${pkg}]`, [...esmSteps]) || runSteps('Compile', [...cjsSteps])
}

export const compileAll = ({ target, incremental }: CompileParams) => {
  const incrementalOptions = incremental ? ['--since', '-ptA', '-j', '32'] : ['-ptA', '-j', '32']
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', '-t', 'cjs']],
          ['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-compile-cjs']],
          ['yarn', ['xy', 'copy-assets', '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', '-t', 'esm']],
          ['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-compile-esm']],
          ['yarn', ['xy', 'copy-assets', '-t', 'esm']],
        ]
      : []

  return (
    runSteps(`Compile [All${incremental ? '-Incremental' : ''}]`, [...esmSteps]) ||
    runSteps(`Compile [All${incremental ? '-Incremental' : ''}]`, [...cjsSteps])
  )
}
