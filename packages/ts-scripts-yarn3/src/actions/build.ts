import { runSteps } from '../lib'

export interface BuildParams {
  target?: 'esm' | 'cjs'
  pkg?: string
}

export const build = ({ target }: BuildParams) => {
  runSteps('Build', [
    ['yarn', target ? `xy compile -t ${target}` : 'xy compile'],
    ['yarn', 'lint'],
  ])
}
