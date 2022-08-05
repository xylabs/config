#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Fix', [['yarn', 'eslint . --fix']])
