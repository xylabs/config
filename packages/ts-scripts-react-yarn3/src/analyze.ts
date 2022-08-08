#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Analyze', [['yarn', ['source-map-explorer', 'build/static/js/*.js']]])
