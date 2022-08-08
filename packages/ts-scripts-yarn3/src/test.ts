#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Test', [['./node_modules/jest/bin/jest.js', '.']])
