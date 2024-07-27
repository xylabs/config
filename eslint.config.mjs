// eslint.config.mjs

import { config as xylabsConfig } from '@xylabs/eslint-config-flat'

export default [
  {
    ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  },
  ...xylabsConfig,
  {
    ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
    rules: {
      'unicorn/no-process-exit': ['off'],
    },
  },
]
