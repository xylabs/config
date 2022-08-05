import chalk from 'chalk'
import { spawnSync, SpawnSyncOptionsWithBufferEncoding } from 'child_process'

import { safeExit } from './safeExit'

export type ScriptStep =
  | [/*command*/ string, /*arg*/ string | string[]]
  | [/*command*/ string, /*arg*/ string | string[], /*config*/ SpawnSyncOptionsWithBufferEncoding]

export const runSteps = (name: string, steps: ScriptStep[]) => {
  safeExit(() => {
    console.log(chalk.green(`${name} [${process.cwd()}]`))
    for (let i = 0; i < steps.length; i++) {
      const [command, args, config] = steps[i]
      const status = spawnSync(command, Array.isArray(args) ? args : args.split(' '), { ...config, stdio: 'inherit' }).status
      if (status) {
        return status
      }
    }
  })
}
