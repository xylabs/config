#!/usr/bin/env node

import { INIT_CWD, runSteps } from './lib'

runSteps('Deps Package', [['yarn', ['depcheck', INIT_CWD()]]])
