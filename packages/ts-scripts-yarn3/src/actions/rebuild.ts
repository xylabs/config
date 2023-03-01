import { runSteps } from '../lib'

export interface RebuildParams {
  pkg?: string
  target?: 'esm' | 'cjs'
}

export const rebuild = ({ target }: RebuildParams) => {
  return runSteps('Rebuild', [
    ['yarn', 'xy clean'],
    ['yarn', target ? `xy compile -t ${target}` : 'xy compile'],
    ['yarn', 'xy relint'],
  ])
}
