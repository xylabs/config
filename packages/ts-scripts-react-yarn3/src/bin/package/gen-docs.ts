#!/usr/bin/env node

import { forget } from '@xylabs/forget'
import { packageGenDocs } from '@xylabs/ts-scripts-yarn3'

forget(packageGenDocs())
