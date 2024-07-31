#!/usr/bin/env node

import { packageGenDocs } from '@xylabs/ts-scripts-yarn3'

packageGenDocs()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
