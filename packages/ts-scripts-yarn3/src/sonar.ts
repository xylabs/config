#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Sonar', [['yarn', 'eslint -c sonar.eslintrc .']])
