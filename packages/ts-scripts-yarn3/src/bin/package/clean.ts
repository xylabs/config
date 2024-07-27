#!/usr/bin/env node

import { packageClean } from '../../actions'

import { forget } from '@xylabs/forget'

forget(packageClean())
