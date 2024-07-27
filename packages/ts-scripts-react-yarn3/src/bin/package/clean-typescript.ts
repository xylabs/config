#!/usr/bin/env node

import { packageCleanTypescript } from '@xylabs/ts-scripts-yarn3'

import { forget } from '@xylabs/forget'

forget(packageCleanTypescript())
