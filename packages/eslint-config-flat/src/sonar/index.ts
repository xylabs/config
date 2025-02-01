import type { Linter } from 'eslint'
import sonarjsPlugin from 'eslint-plugin-sonarjs'

const { rules, ...recommended } = sonarjsPlugin.configs.recommended

export const sonarConfig: Linter.Config = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  ...recommended,
  rules: {
    ...rules,
    'sonarjs/no-small-switch': ['off'],
    'sonarjs/os-command': ['off'],
    'sonarjs/no-os-command-from-path': ['off'],
    'sonarjs/no-nested-conditional': ['off'],
    'sonarjs/todo-tag': ['warn'],
    'sonarjs/deprecation': ['warn'],
    'sonarjs/cognitive-complexity': ['warn'],
    'sonarjs/no-nested-functions': ['off'],
    'sonarjs/function-return-type': ['warn'],
  },
}
