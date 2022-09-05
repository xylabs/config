import { runSteps } from '../lib'

export interface BuildParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const build = ({ target }: BuildParams) => {
  runSteps('Build', [
    ['yarn', target ? `compile -t ${target}` : 'compile'],
    ['yarn', 'lint'],
  ])
}
