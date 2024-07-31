#!/usr/bin/env node

import { packageCleanTypescript } from '../../actions'

packageCleanTypescript()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
