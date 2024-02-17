import { spawnSync } from 'node:child_process'

import { safeExit } from './safeExit'

export type ScriptStep = [/*command*/ string, /*arg*/ string | string[]]

export const runSteps = (name: string, steps: ScriptStep[]) => {
  safeExit(() => {
    console.log(`${name} [${process.cwd()}]`)
    for (const [command, args] of steps) {
      const status = spawnSync(command, Array.isArray(args) ? args : args.split(' '), { encoding: 'utf8', shell: true, stdio: 'inherit' }).status
      if (status) {
        return status
      }
    }
  })
}
