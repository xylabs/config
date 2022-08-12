#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Compile [CJS]', [
  ['yarn', ['tsconfig-gen:cjs']],
  ['yarn', 'workspaces foreach -ptA exec tsc -p ./.tsconfig.build.cjs.json'],
])
