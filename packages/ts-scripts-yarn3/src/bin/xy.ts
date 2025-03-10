#!/usr/bin/env node

import { xy } from '../xy/index.ts'

xy()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
