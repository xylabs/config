// eslint.config.mjs

import { config as xylabsConfig } from '@xylabs/eslint-config-flat'

export default [
  { ignores: ['.yarn/**', '**/dist/**', 'dist', 'build/**', 'node_modules/**', '**/node_modules/**', 'eslint.config.mjs'] },
  ...xylabsConfig,
  { rules: { 'unicorn/no-process-exit': ['off'] } },
]
