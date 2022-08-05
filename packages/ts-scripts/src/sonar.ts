#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Sonar', [['yarn', 'dlx -q eslint -c sonar.eslintrc .']])
