import { spawnSync } from 'child_process'

import { safeExit } from './safeExit'

export type ScriptStep = [/*command*/ string, /*arg*/ string | string[]]

export const runSteps = (name: string, steps: ScriptStep[]) => {
  safeExit(() => {
    console.log(`${name} [${process.cwd()}]`)
    for (let i = 0; i < steps.length; i++) {
      const [command, args] = steps[i]
      const status = spawnSync(command, Array.isArray(args) ? args : args.split(' '), { shell: true, stdio: 'inherit' }).status
      if (status) {
        return status
      }
    }
  })
}
