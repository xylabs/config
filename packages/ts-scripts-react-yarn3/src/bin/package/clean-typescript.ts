#!/usr/bin/env node

import { packageCleanTypescript } from '@xylabs/ts-scripts-yarn3'

packageCleanTypescript()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
