import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import { ESLint, Linter } from 'eslint'

export const importConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  files: ['**/*.ts', '**/*.d.ts', '**/*.tsx', '**/*.d.tsx', '**/*.js', '**/*.d.js', '**/*.jsx', '**/*.d.jsx'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: { modules: true },
      ecmaVersion: 'latest',
      project: './tsconfig-eslint.json',
    },
  },
  plugins: {
    import: importPlugin as ESLint.Plugin,
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
    'import/no-deprecated': ['warn'],
    'import/no-named-as-default-member': ['off'],
    'import/no-named-as-default': ['off'],
    'import/no-restricted-paths': ['warn'],
    'import/no-self-import': ['warn'],
    'import/no-useless-path-segments': ['warn'],
  },
}
