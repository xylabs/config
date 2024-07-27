#!/usr/bin/env node

import { forget } from '@xylabs/forget'
import { packageCleanTypescript } from '@xylabs/ts-scripts-yarn3'

forget(packageCleanTypescript())
