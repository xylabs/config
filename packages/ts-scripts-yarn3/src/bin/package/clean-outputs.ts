#!/usr/bin/env node

import { packageCleanOutputs } from '../../actions/index.ts'

packageCleanOutputs()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
