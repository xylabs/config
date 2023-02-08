import { runSteps } from '../lib'

export const lint = () => {
  return runSteps('Lint [Caching]', [['yarn', ['eslint', '.', '--cache']]])
}
