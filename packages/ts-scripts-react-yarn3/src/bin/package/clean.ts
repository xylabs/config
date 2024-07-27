#!/usr/bin/env node

import { packageClean } from '@xylabs/ts-scripts-yarn3'

import { forget } from '@xylabs/forget'

forget(packageClean())
