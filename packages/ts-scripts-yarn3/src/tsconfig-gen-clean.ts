#!/usr/bin/env node
import { runSteps } from './lib'

runSteps('Clean Configs', [['./node_modules/rimraf/bin.js', ['-q', '**/.tsconfig*']]])
