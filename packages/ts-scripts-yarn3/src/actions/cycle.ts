import { cwd } from 'node:process'

import { ESLint } from 'eslint'

export const cycle = async () => {
  const eslint = new ESLint({
    fix: false,
    overrideConfig: { rules: { 'import-x/no-cycle': ['error', { maxDepth: 10 }] } },
  })
  const results = await eslint.lintFiles(['src/**/*.ts*', 'packages/**/src/**/*.ts*'])

  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results, {
    cwd: cwd(), rulesMeta: {},
  })
  console.log(resultText)

  return results.length
}
