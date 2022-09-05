import { runSteps } from '../lib'

export const test = () => {
  return runSteps('Test', [['node', ['./node_modules/jest/bin/jest.js', '.']]])
}
