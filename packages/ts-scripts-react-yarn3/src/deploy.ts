#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Deploy [Patch]', [
  ['yarn', 'workspaces foreach --all version patch --deferred'],
  ['yarn', 'build'],
  ['yarn', 'cycle'],
  ['yarn', 'gen-docs'],
  ['yarn', 'version apply --all'],
  ['yarn', 'workspaces foreach -pt npm publish'],
])
