#!/usr/bin/env node

import { forget } from '@xylabs/forget'
import { packageClean } from '@xylabs/ts-scripts-yarn3'

forget(packageClean())
