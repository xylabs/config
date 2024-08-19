import { runSteps } from '../lib/index.ts'

export const lintProfile = () => {
  return runSteps('Lint Profile', [['yarn', ['xy', 'lint'], {
    env: {
      ...process.env, TIMING: '1',
    },
  }]])
}
