#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Build', [
  ['yarn', 'version --patch --no-git-tag-version'],
  ['yarn', 'build-ci'],
])
