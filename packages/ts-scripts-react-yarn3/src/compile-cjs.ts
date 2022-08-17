#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Compile [CJS]', [
  ['yarn', 'workspaces foreach -ptA exec tsc -p ./tsconfig.build.cjs.json'],
  ['yarn', 'copy-images:cjs'],
  ['yarn', 'copy-styles:cjs'],
])
