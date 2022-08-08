#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Test', [['yarn', './node_modules/jest/bin/jest.js .']])
