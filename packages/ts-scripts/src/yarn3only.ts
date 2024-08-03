#!/usr/bin/env node

import { isYarnVersionOrGreater, processEx, safeExit } from './lib/index.ts'
safeExit(() => {
  const [valid, version] = isYarnVersionOrGreater(3)
  if (!valid) {
    processEx(`Invalid Yarn version [${version}]`)
  }
})
