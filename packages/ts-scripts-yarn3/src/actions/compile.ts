import { runSteps, ScriptStep } from '../lib'

export interface CompileParams {
  target?: 'esm' | 'cjs'
  incremental?: boolean
  pkg?: string
  verbose?: boolean
}

export interface CompilePackageParams {
  target?: 'esm' | 'cjs'
  pkg: string
  verbose?: boolean
}

export const compile = ({ verbose, target, pkg, incremental }: CompileParams) => {
  return pkg ? compilePackage({ pkg, target, verbose }) : compileAll({ incremental, target, verbose })
}

export const compilePackage = ({ verbose, target, pkg }: CompilePackageParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', pkg, '-t', 'cjs', ...verboseOptions]],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-cjs', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'cjs', ...verboseOptions]],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', pkg, '-t', 'esm', ...verboseOptions]],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-esm', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'esm', ...verboseOptions]],
        ]
      : []

  return runSteps(`Compile [${pkg}]`, [...esmSteps]) || runSteps('Compile', [...cjsSteps])
}

export const compileAll = ({ verbose, target, incremental }: CompileParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const incrementalOptions = incremental ? ['--since', '-ptA'] : ['-ptA']
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', '-t', 'cjs', ...verboseOptions]],
          ['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-compile-cjs', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', '-t', 'cjs', ...verboseOptions]],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', '-t', 'esm', ...verboseOptions]],
          ['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-compile-esm', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', '-t', 'esm', ...verboseOptions]],
        ]
      : []

  return (
    runSteps(`Compile [All${incremental ? '-Incremental' : ''}]`, [...esmSteps]) ||
    runSteps(`Compile [All${incremental ? '-Incremental' : ''}]`, [...cjsSteps])
  )
}
