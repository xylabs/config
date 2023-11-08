import { ESLint } from 'eslint'

export const jsonConfig: ESLint.ConfigData = {
  overrides: [
    {
      extends: 'plugin:eslint-plugin-json-es/recommended',
      files: ['*.json'],
      parser: 'eslint-plugin-json-es',
      rules: {
        'prettier/prettier': ['off'],
      },
    },
  ],
}
