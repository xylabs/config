import { Linter } from 'eslint'
import sonarjsPlugin from 'eslint-plugin-sonarjs'

export const sonarConfig: Linter.Config = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  ...sonarjsPlugin.configs,
  rules: {
    ...sonarjsPlugin.configs.recommended.rules,
    'sonarjs/no-small-switch': ['off'],
  },
}
