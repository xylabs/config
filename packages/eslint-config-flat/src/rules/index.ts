import { Linter } from 'eslint'
//import tsParser from '@typescript-eslint/parser'
//import deprecation from 'eslint-plugin-deprecation'

export const rulesConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  plugins: {},
  rules: {
    //...deprecation.configs.recommended.rules,
    complexity: ['error', 18],
    //'deprecation/deprecation': ['warn'],
    'max-depth': ['error', 6],
    'max-lines': [
      'error',
      {
        max: 512,
        skipBlankLines: true,
      },
    ],
    'max-nested-callbacks': ['error', 6],
    'max-statements': ['error', 32],
    'no-restricted-imports': [
      'warn',
      {
        paths: [
          'lodash',
          'react-player',
          'filepond',
          'aos',
          'react-icons',
          '.',
          '..',
          '../..',
          '../../..',
          '../../../..',
          '../../../../..',
          '../../../../../..',
          '../../../../../../..',
        ],
      },
    ],
    //'no-secrets/no-secrets': ['off'],
    'no-tabs': ['error'],
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    quotes: [2, 'single', 'avoid-escape'],
    'require-await': 'error',
    semi: ['warn', 'never'],
    //'sort-keys-fix/sort-keys-fix': 'warn',
  },
}
