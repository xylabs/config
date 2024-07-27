#!/usr/bin/env node

import { packageCleanOutputs } from '@xylabs/ts-scripts-yarn3'

import { forget } from '@xylabs/forget'

forget(packageCleanOutputs())
