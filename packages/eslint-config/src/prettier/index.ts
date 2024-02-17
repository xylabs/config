import { ESLint } from 'eslint'

export const prettierConfig: ESLint.ConfigData = {
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        bracketSpacing: true,
        endOfLine: 'lf',
        experimentalTernaries: true,
        printWidth: 150,
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      },
    ],
  },
}
