#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Test', [['yarn', 'jest .']])
