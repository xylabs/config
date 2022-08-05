#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Deploy', [
  ['yarn', 'cycle'],
  ['yarn', 'build'],
  ['yarn', 'version patch -i'],
  ['yarn', 'npm publish'],
])
