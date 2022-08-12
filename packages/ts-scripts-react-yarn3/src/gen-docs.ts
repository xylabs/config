#!/usr/bin/env node

import { cwd } from 'process'

import { runSteps } from './lib'

runSteps('Generate TypeDocs', [
  [
    'yarn',
    [
      'workspaces',
      'foreach',
      '-ptA',
      'exec',
      `${cwd()}/node_modules/typedoc/bin/typedoc`,
      '--logLevel',
      'Error',
      '--tsconfig',
      './tsconfig.build.esm.json',
      '--excludeExternals',
      './src/index.ts',
      '--json',
      './dist/docs.json',
    ],
  ],
])
