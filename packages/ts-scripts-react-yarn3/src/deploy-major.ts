#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Deploy [Major]', [
  ['yarn', 'clean'],
  ['yarn', 'workspaces foreach --all version minor --deferred'],
  ['yarn', 'cycle'],
  ['yarn', 'build'],
  ['yarn', 'gen-docs'],
  ['yarn', 'version apply --all'],
  ['yarn', 'workspaces foreach -pt npm publish'],
])
