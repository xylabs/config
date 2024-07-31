#!/usr/bin/env node

import { packageGenDocs } from '../../actions'

packageGenDocs()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
