#!/usr/bin/env node
import { spawn } from 'child_process'

import { processEx } from './processEx'

export const safeSpawn = (command: string, args?: ReadonlyArray<string>) => {
  const child = spawn(command, args)

  child.on('error', (error) => {
    processEx(error)
  })

  child.on('close', (code) => {
    if (code) {
      process.exitCode = code
      processEx(`Error closing [${code}]`)
    }
  })

  child.on('exit', (code) => {
    if (code) {
      process.exitCode = code
      processEx(`Error exiting [${code}]`)
    }
  })

  return child
}
