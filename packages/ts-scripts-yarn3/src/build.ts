#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Build', [
  ['yarn', 'compile'],
  ['yarn', 'gen-docs'],
  ['yarn', 'lint'],
])
