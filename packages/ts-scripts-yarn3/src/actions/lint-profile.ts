import { runSteps } from '../lib'

export const lintProfile = () => {
  return runSteps('Lint Profile', [['yarn', ['xy', 'lint'], { env: { ...process.env, TIMING: '1' } }]])
}
