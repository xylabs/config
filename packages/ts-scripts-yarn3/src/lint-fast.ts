#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint', [['yarn', 'eslint . --cache']])
