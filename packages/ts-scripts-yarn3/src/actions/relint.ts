import { runSteps } from '../lib'

export const relint = () => {
  return runSteps('Relint [Caching]', [['yarn', ['eslint', '.']]])
}
