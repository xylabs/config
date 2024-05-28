import unicorn from 'eslint-plugin-unicorn'
import { Linter } from 'eslint'

export const unicornConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  plugins: { unicorn },
  rules: {
    ...unicorn.configs['flat/recommended'].rules,
    'unicorn/catch-error-name': ['off'],
    'unicorn/consistent-function-scoping': ['off'],
    'unicorn/filename-case': ['off'],
    'unicorn/new-for-builtins': ['off'],
    'unicorn/no-array-callback-reference': ['off'],
    'unicorn/no-await-expression-member': ['off'],
    'unicorn/no-nested-ternary': ['off'],
    'unicorn/no-null': ['off'],
    'unicorn/number-literal-case': ['off'],
    'unicorn/prefer-module': ['off'],
    'unicorn/prefer-top-level-await': ['off'],
    'unicorn/prevent-abbreviations': ['off'],
  },
}
