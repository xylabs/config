import { Linter } from 'eslint'
import prettier from 'eslint-plugin-prettier'

export const prettierConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  files: ['**/*.ts', '**/*.d.ts', '**/*.tsx', '**/*.d.tsx', '**/*.js', '**/*.d.js', '**/*.jsx', '**/*.d.jsx', '*.mjs', '*.d.mjs', '*.d.cjs'],
  plugins: { prettier },
  rules: {
    ...(prettier.configs?.recommended as any).rules,
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
