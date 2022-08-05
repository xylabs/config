#!/usr/bin/env node

import { INIT_CWD, runSteps } from './lib'

runSteps('Compile Package [CJS]', [['yarn', `tsc -p ${INIT_CWD()}/tsconfig.build.cjs.json`]])
