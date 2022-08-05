#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Lint Fast', [['yarn', 'eslint . --cache']])
