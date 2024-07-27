#!/usr/bin/env node

import { forget } from '@xylabs/forget'
import { packageCleanOutputs } from '@xylabs/ts-scripts-yarn3'

forget(packageCleanOutputs())
