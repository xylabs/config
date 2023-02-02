import { runSteps } from '../lib'

export interface BuildParams {
  pkg?: string
  target?: 'esm' | 'cjs'
  verbose?: boolean
}

export const build = ({ target, verbose }: BuildParams) => {
  const verboseOptions = verbose ? ['-v'] : []
  const targetOptions = target ? ['-t', target] : []
  return runSteps('Build', [
    ['yarn', ['xy', 'compile', ...targetOptions, ...verboseOptions]],
    ['yarn', ['xy', 'lint', ...verboseOptions]],
    ['yarn', ['xy', 'deps', ...verboseOptions]],
    ['yarn', ['xy', 'statics', ...verboseOptions]],
  ])
}
