#!/usr/bin/env node

import { runSteps } from '@xylabs/ts-scripts-yarn3'

runSteps('Analyze', [['yarn', ['source-map-explorer', 'build/static/js/*.js']]])
