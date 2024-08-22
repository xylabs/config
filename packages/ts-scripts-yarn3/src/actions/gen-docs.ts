import type { ScriptStep } from '../lib/index.ts'
import { runSteps } from '../lib/index.ts'

export interface GenDocsParams {
  incremental?: boolean
  pkg?: string
}

export interface GenDocsPackageParams { pkg: string }

export const genDocs = ({ pkg, incremental }: GenDocsParams) => {
  return pkg ? genDocsPackage({ pkg }) : genDocsAll({ incremental })
}

export const genDocsPackage = ({ pkg }: GenDocsPackageParams) => {
  const steps: ScriptStep[] = [['yarn', ['workspace', pkg, 'run', 'package-gen-docs']]]

  return runSteps(`GenDocs [${pkg}]`, [...steps])
}

export const genDocsAll = ({ incremental }: GenDocsParams) => {
  const incrementalOptions = incremental ? ['--since', '-pA'] : ['-pA']
  const steps: ScriptStep[] = [['yarn', ['workspaces', 'foreach', ...incrementalOptions, 'run', 'package-gen-docs']]]

  return runSteps(`GenDocs [All${incremental ? '-Incremental' : ''}]`, [...steps])
}
