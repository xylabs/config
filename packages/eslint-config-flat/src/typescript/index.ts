import esStylistic from '@stylistic/eslint-plugin'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { ESLint, Linter } from 'eslint'
import dependPlugin from 'eslint-plugin-depend'

export const ignores = [
  '.yarn', 'node_modules', '**/node_modules', 'dist', '**/dist', '**/docs', 'public', 'storybook-static', '.storybook', '.eslintcache', '.github', '.vscode', '.husky', '.jest', '.next', '.storybook', '.vscode', 'coverage', 'cypress', 'dist', 'node_modules', 'public', 'storybook-static', 'tmp', 'yarn-error.log', 'yarn.lock',
]

export const typescriptConfig: Linter.Config = {
  ignores,
  files: ['**/*.ts', '**/*.d.ts', '**/*.tsx', '**/*.d.tsx', '**/*.ts', '**/*.d.ts', '**/*.jsx', '**/*.d.jsx', '**/*.js', '**/*.cjs', '**/*.mjs'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { modules: true },
      ecmaVersion: 'latest',
      project: './tsconfig-eslint.json',
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin as unknown as ESLint.Plugin,
    '@stylistic': esStylistic as unknown as ESLint.Plugin,
    'depend': dependPlugin,
  },
  rules: {
    ...tsPlugin.configs.recommended.rules,
    ...esStylistic.configs['recommended-flat'].rules,
    ...dependPlugin.configs['flat/recommended'].rules,
    '@typescript-eslint/no-empty-object-type': ['off'],
    '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'no-public' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/consistent-type-imports': ['warn'],
    '@stylistic/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: {
          memberTypes: [
            'signature',
            'call-signature',
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-decorated-field',
            'protected-decorated-field',
            'private-decorated-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'public-abstract-field',
            'protected-abstract-field',
            'public-field',
            'protected-field',
            'private-field',
            'static-field',
            'instance-field',
            'abstract-field',
            'decorated-field',
            'field',
            'public-constructor',
            'protected-constructor',
            'private-constructor',
            'constructor',
            ['public-static-get', 'public-static-set'],
            ['protected-static-get', 'protected-static-set'],
            ['private-static-get', 'private-static-set'],
            ['public-decorated-get', 'public-decorated-set'],
            ['protected-decorated-get', 'protected-decorated-set'],
            ['private-decorated-get', 'private-decorated-set'],
            ['public-instance-get', 'public-instance-set'],
            ['protected-instance-get', 'protected-instance-set'],
            ['private-instance-get', 'private-instance-set'],
            ['public-abstract-get', 'public-abstract-set'],
            ['protected-abstract-get', 'protected-abstract-set'],
            ['public-get', 'public-set'],
            ['protected-get', 'protected-set'],
            ['private-get', 'private-set'],
            ['static-get', 'static-set'],
            ['instance-get', 'instance-set'],
            ['abstract-get', 'abstract-set'],
            ['decorated-get', 'decorated-set'],
            'get',
            'set',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'public-decorated-method',
            'protected-decorated-method',
            'private-decorated-method',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
            'public-abstract-method',
            'protected-abstract-method',
            'public-method',
            'protected-method',
            'private-method',
            'static-method',
            'instance-method',
            'abstract-method',
            'decorated-method',
            'method',
          ],
          order: 'alphabetically',
        },
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'semi': ['warn', 'never'],
  },
}
