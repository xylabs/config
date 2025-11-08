import tsParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import reactDomPlugin from 'eslint-plugin-react-dom'
import reactHooksExtraPlugin from 'eslint-plugin-react-hooks-extra'
import reactNamingConventionPlugin from 'eslint-plugin-react-naming-convention'
import eslintReactRefreshPlugin from 'eslint-plugin-react-refresh'
import reactWebApiPlugin from 'eslint-plugin-react-web-api'
import reactPlugin from 'eslint-plugin-react-x'
import globals from 'globals'

export const reactConfig = {
  files: ['**/*.{ts,tsx}'],
  ...reactDomPlugin.configs.recommended,
  plugins: {
    'react-x': reactPlugin,
    'react-dom': reactDomPlugin,
    'react-web-api': reactWebApiPlugin,
    'react-refresh': eslintReactRefreshPlugin,
    'react-hooks-extra': reactHooksExtraPlugin,
    'react-naming-convention': reactNamingConventionPlugin,
  },
  // settings: { react: { version: 'detect' } },
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
    globals: { ...globals.browser },
  },
  rules: {
    ...reactDomPlugin.configs.recommended.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactWebApiPlugin.configs.recommended.rules,
    ...reactHooksExtraPlugin.configs.recommended.rules,
    ...reactNamingConventionPlugin.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
} as unknown as Linter.Config
