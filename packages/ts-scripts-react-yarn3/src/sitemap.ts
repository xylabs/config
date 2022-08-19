#!/usr/bin/env node

import { runSteps } from '@xylabs/ts-scripts-yarn3'

runSteps('Sitemap', [['ts-node-script', './scripts/sitemap.ts']])
