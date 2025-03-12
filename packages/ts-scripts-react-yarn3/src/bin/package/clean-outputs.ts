#!/usr/bin/env node

import { packageCleanOutputs } from '@xylabs/ts-scripts-yarn3'

process.exitCode = packageCleanOutputs()
