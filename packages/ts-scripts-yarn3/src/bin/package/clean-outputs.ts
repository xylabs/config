#!/usr/bin/env node

import { packageCleanOutputs } from '../../actions'

import { forget } from '@xylabs/forget'

forget(packageCleanOutputs())
