#!/usr/bin/env node

import { processEx, safeExit, safeSpawn } from './lib'
safeExit(() => {
  const child = safeSpawn('yarn', ['-v'])
  child.stdout.on('data', (data: string) => {
    const version = data.toString().replaceAll('\n', '')
    if (!version.startsWith('3.')) {
      processEx(`Invalid Yarn version [${version}]`)
    }
  })
})
