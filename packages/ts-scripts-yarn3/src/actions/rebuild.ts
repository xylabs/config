import { runSteps } from '../lib'

export interface RebuildParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const rebuild = ({ target }: RebuildParams) => {
  return runSteps('Rebuild', [
    ['yarn', 'xy clean'],
    ['yarn', target ? `xy compile -t ${target}` : 'xy compile'],
    ['yarn', 'xy lint'],
  ])
}
