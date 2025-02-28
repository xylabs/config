import { Linter } from 'eslint'

export const rulesConfig: Linter.Config = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  rules: {
    'complexity': ['error', 18],
    'max-depth': ['error', 6],
    'max-lines': [
      'error',
      {
        max: 512,
        skipBlankLines: true,
      },
    ],
    'array-element-newline': ['warn', 'consistent'],
    'max-nested-callbacks': ['error', 6],
    'max-statements': ['error', 32],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          './index.ts',
          '../index.ts',
          '../../index.ts',
          '../../../index.ts',
          '../../../../index.ts',
          '../../../../../index.ts',
          '../../../../../../index.ts',
          '../../../../../../../index.ts',
        ],
      },
    ],
    // 'no-secrets/no-secrets': ['off'],
    'no-tabs': ['error'],
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'quotes': [2, 'single', 'avoid-escape'],
    'require-await': 'error',
    'semi': ['warn', 'never'],
    // 'sort-keys-fix/sort-keys-fix': 'warn',
  },
}
