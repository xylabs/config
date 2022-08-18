import { runSteps } from '../lib'

export const test = () => {
  runSteps('Test', [['node', ['./node_modules/jest/bin/jest.js', '.']]])
}
