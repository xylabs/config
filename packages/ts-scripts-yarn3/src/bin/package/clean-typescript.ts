#!/usr/bin/env node

import { forget } from '@xylabs/forget'

import { packageCleanTypescript } from '../../actions'

forget(packageCleanTypescript())
