import { Linter } from 'eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export const reactConfig: Linter.FlatConfig = {
  plugins: {
    ...reactPlugin.configs.flat.recommended.plugins,
    ...reactHooksPlugin.configs.flat.recommended.plugins,
  },
  files: ['*.tsx'],
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    ...reactHooksPlugin.configs.flat.recommended.rules,
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
    ...reactPlugin.configs.flat.recommended.settings,
    ...reactHooksPlugin.configs.flat.recommended.settings,
  },
}
