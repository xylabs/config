#!/usr/bin/env node

import { forget } from '@xylabs/forget'

import { packageCleanOutputs } from '../../actions'

forget(packageCleanOutputs())
