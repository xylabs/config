import json from '@eslint/json'
import type { ESLint, Linter } from 'eslint'

export const jsonConfig: Linter.Config = {
  files: ['**/*.json'],
  plugins: { json: json as unknown as ESLint.Plugin },
  language: 'json/json',
  rules: { 'json/no-duplicate-keys': ['error'] },
}

export const jsoncConfig: Linter.Config = {
  files: ['**/*.jsonc'],
  plugins: { json: json as unknown as ESLint.Plugin },
  language: 'json/jsonc',
  rules: { 'json/no-duplicate-keys': ['error'] },
}

export const json5Config: Linter.Config = {
  files: ['**/*.json5'],
  plugins: { json: json as unknown as ESLint.Plugin },
  language: 'json/json5',
  rules: { 'json/no-duplicate-keys': ['error'] },
}
