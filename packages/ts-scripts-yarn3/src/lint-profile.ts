#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint Profile', [['yarn', 'eslint .', { env: { ...process.env, TIMING: '1' } }]])
