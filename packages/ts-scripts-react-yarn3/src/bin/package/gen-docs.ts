#!/usr/bin/env node

import { packageGenDocs } from '@xylabs/ts-scripts-yarn3'

import { forget } from '@xylabs/forget'

forget(packageGenDocs())
