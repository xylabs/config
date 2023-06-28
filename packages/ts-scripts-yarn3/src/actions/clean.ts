import { runSteps } from '../lib'
import { cleanDocs } from './clean-docs'
import { cleanESLint } from './clean-eslint'
import { cleanJest } from './clean-jest'

export interface CleanParams {
  pkg?: string
}

export const clean = () => {
  return cleanJest() + cleanESLint() + cleanDocs() + runSteps('Clean', [['yarn', 'workspaces foreach -pA run package-clean']])
}
