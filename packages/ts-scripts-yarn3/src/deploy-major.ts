#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Deploy [Major]', [
  ['yarn', 'yarn workspaces foreach --all version minor --deferred'],
  ['yarn', 'cycle'],
  ['yarn', 'build'],
  ['yarn', 'version apply --all'],
  ['yarn', 'workspaces foreach -pt npm publish'],
])
