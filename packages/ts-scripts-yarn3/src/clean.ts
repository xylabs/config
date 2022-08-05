#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Clean', [['yarn', 'yarn workspaces foreach -pA run clean:package']])
