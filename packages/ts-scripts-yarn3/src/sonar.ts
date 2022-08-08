#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Sonar', [['node', ['./node_modules/eslint/bin/eslint.js', '-c', 'sonar.eslintrc', '.']]])
