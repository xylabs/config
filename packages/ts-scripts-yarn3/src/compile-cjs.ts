#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Compile [CJS]', [['yarn', 'workspaces foreach -ptA run compile:package:cjs']])
