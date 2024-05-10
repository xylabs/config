import prettier from 'eslint-plugin-prettier'

export const prettierConfig = [
  {
    plugins: { prettier },
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
  },
  prettier.configs?.recommended,
]
