import { runSteps, ScriptStep } from '../lib'

export interface CompileParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export interface CompilePackageParams {
  target?: 'esm' | 'cjs'
  pkg: string
}

export const compile = ({ target, pkg }: CompileParams) => {
  return pkg ? compilePackage({ pkg, target }) : compileAll({ target })
}

export const compilePackage = ({ target, pkg }: CompilePackageParams) => {
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'cjs']],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-cjs']],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'esm']],
          ['yarn', ['workspace', pkg, 'run', 'package-compile-esm']],
          ['yarn', ['xy', 'copy-assets', pkg, '-t', 'esm']],
        ]
      : []

  return runSteps(`Compile [${pkg}]`, [...esmSteps]) || runSteps('Compile', [...cjsSteps])
}

export const compileAll = ({ target }: CompileParams) => {
  const cjsSteps: ScriptStep[] =
    !target || target === 'cjs'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'cjs']],
          ['yarn', 'workspaces foreach -ptA run package-compile-cjs'],
          ['yarn', ['xy', 'copy-assets', '-t', 'cjs']],
        ]
      : []

  const esmSteps: ScriptStep[] =
    !target || target === 'esm'
      ? [
          ['yarn', ['tsconfig-gen', '-t', 'esm']],
          ['yarn', 'workspaces foreach -ptA run package-compile-esm'],
          ['yarn', ['xy', 'copy-assets', '-t', 'esm']],
        ]
      : []

  return runSteps('Compile [All]', [...esmSteps]) || runSteps('Compile [All]', [...cjsSteps])
}
