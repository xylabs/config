#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Deploy [Patch]', [
  ['yarn', 'workspaces foreach --all version patch --deferred'],
  ['yarn', 'cycle'],
  ['yarn', 'build'],
  ['yarn', 'version apply --all'],
  ['yarn', 'workspaces foreach -pt npm publish'],
])
