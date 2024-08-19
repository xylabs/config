import type { ESLint, Linter } from 'eslint'
import jsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'

export const jsonConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
  plugins: {
    jsonc: jsonc as unknown as ESLint.Plugin,
  },
  languageOptions: {
    parser: jsoncParser,
  },
  rules: {
    ...jsonc.configs['all'].rules,

    /// Support arrays with and without new lines but they can't mix
    'jsonc/array-element-newline': ['error', 'consistent'],

    'jsonc/auto': 'off',

    /// see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/comma-dangle.html
    'jsonc/comma-dangle': ['error', 'only-multiline'],

    /// Indent with 2 spaces
    'jsonc/indent': ['error', 2, {}],

    /// Not all keys are camelCase
    'jsonc/key-name-casing': 'off',

    /// jsonc and json5 can have comments
    'jsonc/no-comments': 'off',

    /// Don't sort keys. We want to keep the order of keys as they are:
    /// especially in arrays.
    'jsonc/sort-keys': 'off',
  },
}
