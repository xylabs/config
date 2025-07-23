// eslint.config.mjs

import { config as xylabsConfig } from '@xylabs/eslint-config-flat'

export default [
  { ignores: ['.yarn/**', 'build', '**/build/**', '**/dist/**', 'dist', 'node_modules/**', '**/node_modules/**', 'eslint.config.mjs'] },
  ...xylabsConfig,
  {
    rules:
    {
      'unicorn/no-process-exit': ['off'],
      '@typescript-eslint/triple-slash-reference': ['off'],
      '@typescript-eslint/strict-boolean-expressions': ['off'],
    }
  },
]
