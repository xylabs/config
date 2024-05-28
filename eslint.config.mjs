// eslint.config.js

import { config as xylabsConfig } from '@xylabs/eslint-config-flat'

export default [
  ...xylabsConfig,
  {
    ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'],
      'import/no-internal-modules': ['off'],
      '@typescript-eslint/no-floating-promises': ['off'],
      'unicorn/no-process-exit': ['off'],
      'unicorn/no-static-only-class': ['off'],
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            '@types/node',
            '@xyo-network/archivist',
            '@xyo-network/bridge',
            '@xyo-network/core',
            '@xyo-network/diviner',
            '@xyo-network/module',
            '@xyo-network/modules',
            '@xyo-network/node',
            '@xyo-network/sdk',
            '@xyo-network/plugins',
            '@xyo-network/protocol',
            '@xyo-network/sentinel',
            '@xyo-network/witness',
            '@xyo-network/core-payload-plugins',
            'react-player',
            'filepond',
            'aos',
            'react-icons',
            '.',
            '..',
            '../..',
            '../../..',
            '../../../..',
            '../../../../..',
            '../../../../../..',
            '../../../../../../..',
          ],
        },
      ],
    },
  },
]
