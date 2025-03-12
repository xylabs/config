#!/usr/bin/env node

import { packageCleanTypescript } from '../../actions/index.ts'

process.exitCode = packageCleanTypescript()
