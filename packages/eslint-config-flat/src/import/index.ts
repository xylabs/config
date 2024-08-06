import tsParser from '@typescript-eslint/parser'
import { ESLint, Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export const importConfig: Linter.Config = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  files: ['**/*.ts', '**/*.d.ts', '**/*.tsx', '**/*.d.tsx', '**/*.ts', '**/*.d.ts', '**/*.jsx', '**/*.d.jsx'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { modules: true },
      ecmaVersion: 'latest',
      project: './tsconfig-eslint.json',
    },
  },
  plugins: {
    'import': importPlugin as ESLint.Plugin,
    'simple-import-sort': simpleImportSort,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig-eslint.json',
      },
    },
  },
  rules: {
    ...(importPlugin.configs.recommended as ESLint.ConfigData).rules,
    'simple-import-sort/imports': ['warn'],
    'simple-import-sort/exports': ['warn'],
    'import/default': ['off'],
    'import/named': ['off'],
    'import/namespace': ['off'],
    'import/no-absolute-path': ['warn'],
    'import/no-cycle': [
      'warn',
      {
        maxDepth: 2,
      },
    ],
    'import/no-default-export': ['warn'],
    'import/no-deprecated': ['off'],
    'import/no-internal-modules': [
      'warn',
      {
        allow: [
          // Allow imports to any index.js file
          '**/index.js',
          '**/index.ts',
          '**/index.jsx',
          '**/index.tsx',
        ],
      },
    ],
    'import/no-named-as-default-member': ['off'],
    'import/no-named-as-default': ['off'],
    'import/no-restricted-paths': ['warn'],
    'import/no-self-import': ['warn'],
    'import/no-useless-path-segments': ['warn'],
  },
}
