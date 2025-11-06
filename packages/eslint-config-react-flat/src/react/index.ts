import eslintReactPlugin from '@eslint-react/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import eslintReactRefreshPlugin from 'eslint-plugin-react-refresh'
import globals from 'globals'

export const reactConfig = {
  files: ['**/*.{ts,tsx}'],
  ...eslintReactPlugin.configs.recommended,
  plugins: {
    'react': eslintReactPlugin,
    'react-refresh': eslintReactRefreshPlugin,
  },
  settings: { react: { version: 'detect' } },
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
    globals: { ...globals.browser },
  },
  rules: {
    ...eslintReactPlugin.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
} as unknown as Linter.Config
