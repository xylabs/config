import { runSteps } from '../lib'

export const lintProfile = () => {
  return runSteps('Lint Profile', [['yarn', ['eslint', '.'], { env: { ...process.env, TIMING: '1' } }]])
}
