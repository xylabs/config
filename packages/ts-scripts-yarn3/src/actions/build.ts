import { runSteps } from '../lib'

export interface BuildParams {
  target?: 'esm' | 'cjs'
  pkg?: string
  verbose?: boolean
}

export const build = ({ target, verbose }: BuildParams) => {
  return runSteps('Build', [
    ['yarn', target ? `xy compile -t ${target}${verbose ? ' -v' : ''}` : 'xy compile'],
    ['yarn', 'xy lint'],
    ['yarn', 'xy deps'],
  ])
}
