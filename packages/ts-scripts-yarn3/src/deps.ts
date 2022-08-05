#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Deps', [['yarn', 'workspaces foreach -pAv run deps:package']])
