import { runSteps, ScriptStep } from '../lib'

export interface CompileParams {
  incremental?: boolean
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
  const cjsSteps: ScriptStep[] =
    target === 'cjs'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', pkg, '-t', 'cjs', ...verboseOptions]],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-cjs', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'cjs', ...verboseOptions]],
        ]
      : []

  const esmSteps: ScriptStep[] =
    target === 'esm'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', pkg, '-t', 'esm', ...verboseOptions]],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-esm', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'esm', ...verboseOptions]],
        ]
      : []

  const bothSteps: ScriptStep[] = !target
    ? [
        ['yarn', ['xy', 'tsconfig-gen', pkg, ...verboseOptions]],
        ['yarn', ['workspace', pkg, 'run', 'package-compile', ...verboseOptions]],
        ['yarn', ['xy', 'copy-assets', pkg, ...verboseOptions]],
      ]
    : []

  return runSteps(`Compile [${pkg}]`, [...esmSteps, ...cjsSteps, ...bothSteps])
}

export const compileAll = ({ verbose, target, incremental }: CompileParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const incrementalOptions = incremental ? ['--since', '-ptA'] : ['-ptA']
  const cjsSteps: ScriptStep[] =
    target === 'cjs'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', '-t', 'cjs', ...verboseOptions]],
          ['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-compile-cjs', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', '-t', 'cjs', ...verboseOptions]],
        ]
      : []

  const esmSteps: ScriptStep[] =
    target === 'esm'
      ? [
          ['yarn', ['xy', 'tsconfig-gen', '-t', 'esm', ...verboseOptions]],
          ['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-compile-esm', ...verboseOptions]],
          ['yarn', ['xy', 'copy-assets', '-t', 'esm', ...verboseOptions]],
        ]
      : []

  const bothSteps: ScriptStep[] = !target
    ? [
        ['yarn', ['xy', 'tsconfig-gen', ...verboseOptions]],
        ['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-compile', ...verboseOptions]],
        ['yarn', ['xy', 'copy-assets', ...verboseOptions]],
      ]
    : []

  return runSteps(`Compile [All${incremental ? '-Incremental' : ''}]`, [...esmSteps, ...cjsSteps, ...bothSteps])
}
