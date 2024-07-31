#!/usr/bin/env node

import { packageCleanOutputs } from '@xylabs/ts-scripts-yarn3'

packageCleanOutputs()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
