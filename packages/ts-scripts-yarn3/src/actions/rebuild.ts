import { runSteps } from '../lib/index.ts'

export interface RebuildParams {
  pkg?: string
  target?: 'esm' | 'cjs'
}

export const rebuild = ({ target }: RebuildParams) => {
  return runSteps('Rebuild', [
    ['yarn', 'xy clean'],
    ['yarn', target ? `xy build -t ${target}` : 'xy build'],
  ])
}
