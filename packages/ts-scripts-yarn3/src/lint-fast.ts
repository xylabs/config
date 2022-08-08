#!/usr/bin/env node

import chalk from 'chalk'

import { runSteps } from './lib'

console.log(chalk.magenta("Deprected.  Use 'yarn lint' instead"))

runSteps('Lint [Caching]', [['./node_modules/eslint/bin/eslint.js', ['.', '--cache']]])
