#!/usr/bin/env node

import { INIT_CWD, runSteps } from './lib'

runSteps('Compile Package [ESM]', [['yarn', `tsc -p ${INIT_CWD()}/tsconfig.build.esm.json`]])
