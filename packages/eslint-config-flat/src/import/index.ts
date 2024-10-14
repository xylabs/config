import tsParser from '@typescript-eslint/parser'
import type { ESLint, Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import-x'
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
    'import-x': importPlugin as unknown as ESLint.Plugin,
    'simple-import-sort': simpleImportSort,
  },
  settings: { 'import-x/resolver': { typescript: { project: './tsconfig-eslint.json' } } },
  rules: {
    ...(importPlugin.configs.recommended as ESLint.ConfigData).rules,
    'simple-import-sort/imports': ['warn'],
    'simple-import-sort/exports': ['warn'],
    'import-x/default': ['off'],
    'import-x/named': ['off'],
    'import-x/namespace': ['off'],
    'import-x/no-absolute-path': ['warn'],
    'import-x/no-cycle': [
      'warn',
      { maxDepth: 2 },
    ],
    'import-x/no-default-export': ['warn'],
    'import-x/no-deprecated': ['off'],
    'import-x/no-internal-modules': [
      'warn',
      {
        allow: [
          'vitest/*', // Allow imports from vitest
          '@*/**', // Allow imports from any @scoped package
          // Allow imports to any index.js file
          '**/index.js',
          '**/index.ts',
          '**/index.jsx',
          '**/index.tsx',
        ],
      },
    ],
    'import-x/no-named-as-default-member': ['off'],
    'import-x/no-named-as-default': ['off'],
    'import-x/no-restricted-paths': ['warn'],
    'import-x/no-self-import': ['warn'],
    'import-x/no-useless-path-segments': ['warn'],
  },
}
