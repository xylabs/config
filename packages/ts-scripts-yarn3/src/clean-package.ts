#!/usr/bin/env node
import { INIT_CWD, runSteps } from './lib'

runSteps('Clean Package', [['yarn', `rimraf -q ${INIT_CWD()}/dist`]])
