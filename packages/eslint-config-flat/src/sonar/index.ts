import { Linter } from 'eslint'
import sonarjsPlugin from 'eslint-plugin-sonarjs'

export const sonarConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  ...sonarjsPlugin.configs.recommended,
}
