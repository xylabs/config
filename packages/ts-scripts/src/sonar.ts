#!/usr/bin/env node
import { runSteps } from './lib/index.ts'

runSteps('Sonar', [['yarn', 'dlx -q eslint -c sonar.eslintrc .']])
