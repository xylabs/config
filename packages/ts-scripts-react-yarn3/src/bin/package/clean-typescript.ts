#!/usr/bin/env node

import { packageCleanTypescript } from '@xylabs/ts-scripts-yarn3'

process.exitCode = packageCleanTypescript()
