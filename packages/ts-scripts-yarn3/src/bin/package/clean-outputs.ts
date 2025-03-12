#!/usr/bin/env node

import { packageCleanOutputs } from '../../actions/index.ts'

process.exitCode = packageCleanOutputs()
