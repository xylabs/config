import { Linter } from 'eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export const reactConfig: Linter.FlatConfig = {
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
  files: ['*.tsx'],
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    'import/no-nodejs-modules': ['error'],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useAsyncEffect|usePromise)',
      },
    ],
    'react/prop-types': ['off'],
    'react/react-in-jsx-scope': ['warn'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
