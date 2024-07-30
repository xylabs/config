import { Linter } from 'eslint'
import reactPlugin from 'eslint-plugin-react'
//import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

export const reactConfig: Linter.FlatConfig = {
  plugins: {
    react: reactPlugin,
    //'react-hooks': reactHooksPlugin,
  },
  files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
  languageOptions: {
    ...reactPlugin.configs.flat.recommended.languageOptions,
    globals: {
      ...globals.serviceworker,
      ...globals.browser,
    },
  },
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    /*'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useAsyncEffect|usePromise)',
      },
    ],*/
    'react/prop-types': ['off'],
    'react/react-in-jsx-scope': ['warn'],
  },
  settings: {
    ...reactPlugin.configs.flat.recommended.settings,
    react: {
      version: 'detect',
    },
  },
}
