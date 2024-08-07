import { runSteps } from '../lib/index.ts'

export const cycle = () => {
  const rules = ['"\'import/no-cycle\': [1, { maxDepth: 6 }]"', "\"'import/no-internal-modules': ['off']\""]
  return runSteps('Cycle', [['yarn', ['eslint', ...rules.flatMap(rule => ['--rule', rule]), '--cache', '.']]])
}
