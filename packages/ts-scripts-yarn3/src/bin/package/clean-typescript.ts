#!/usr/bin/env node

import { packageCleanTypescript } from '../../actions'

import { forget } from '@xylabs/forget'

forget(packageCleanTypescript())
