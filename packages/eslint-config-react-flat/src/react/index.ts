import eslintReactPlugin from '@eslint-react/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
// This rule is disabled since we still need the in-scope react rule
// eslint-disable-next-line depend/ban-dependencies
import reactPlugin from 'eslint-plugin-react'
import globals from 'globals'

export const reactConfig = {
  files: ['**/*.{ts,tsx}'],
  ...eslintReactPlugin.configs.recommended,
  plugins: {
    react: reactPlugin,
    ...eslintReactPlugin.configs.recommended.plugins,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
    },
  },
  rules: {
    ...eslintReactPlugin.configs.recommended.rules,
    ...reactPlugin.configs.flat.recommended.rules,
    'react/prop-types': ['off'],
  },
} as unknown as Linter.Config
