#!/usr/bin/env node

import { runSteps } from '@xylabs/ts-scripts-yarn3'

runSteps('Test', [['yarn', 'react-scripts test']])
