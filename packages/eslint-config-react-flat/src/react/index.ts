import reactPlugin from '@eslint-react/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { Linter } from 'eslint'

export const reactConfig = {
  files: ['**/*.{ts,tsx}'],
  ...reactPlugin.configs.recommended,
  languageOptions: {
    parser: tsParser,
  },
} as unknown as Linter.Config
