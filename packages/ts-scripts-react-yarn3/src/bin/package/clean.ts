#!/usr/bin/env node

import { packageClean } from '@xylabs/ts-scripts-yarn3'

packageClean()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
