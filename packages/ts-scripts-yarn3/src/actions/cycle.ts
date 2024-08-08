import { cwd } from 'node:process'

import { ESLint } from 'eslint'
import importPlugin from 'eslint-plugin-import'

export const cycle = async () => {
  const eslint = new ESLint({ fix: false, overrideConfig: {
    plugins: { import: importPlugin },
    rules: {
      'import/no-cycle': ['error', { maxDepth: 10 }],
    },
  } })
  const configFile = await eslint.findConfigFile()
  console.log('Config file:', configFile)
  const results = await eslint.lintFiles(['src/**/*.ts*', 'packages/**/src/**/*.ts*'])

  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results, { cwd: cwd(), rulesMeta: {} })
  console.log(resultText)

  console.log('Lint Errors:', results.length)
  return results.length
}
