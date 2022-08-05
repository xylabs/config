#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Up', [['yarn', 'outdated']])
