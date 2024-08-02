#!/usr/bin/env node

import { packageClean } from '../../actions/index.ts'

packageClean()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
