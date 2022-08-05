#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('License', [['yarn', ['license-checker', '--exclude', 'MIT, ISC, Apache-2.0, BSD, BSD-2-Clause, CC-BY-4.0, Unlicense, CC-BY-3.0, CC0-1.0']]])
