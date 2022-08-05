#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Compile [ESM]', [['yarn', 'workspaces foreach -ptA run compile:package:esm']])
