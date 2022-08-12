#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Compile [ESM]', [
  ['yarn', ['tsconfig-gen:esm']],
  ['yarn', 'workspaces foreach -ptA exec tsc -p ./tsconfig.build.esm.json'],
])
