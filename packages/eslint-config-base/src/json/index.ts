import { ESLint } from 'eslint'

export const jsonConfig: ESLint.ConfigData = {
  overrides: [
    {
      extends: 'plugin:jsonc/recommended-with-jsonc',
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
    },
  ],
}
