import chalk from 'chalk'
import { spawnSync, SpawnSyncOptionsWithBufferEncoding } from 'child_process'

import { safeExit } from './safeExit'

export type ScriptStep =
  | [/*command*/ string, /*arg*/ string | string[]]
  | [/*command*/ string, /*arg*/ string | string[], /*config*/ SpawnSyncOptionsWithBufferEncoding]

export const runSteps = (name: string, steps: ScriptStep[], exitOnFail = true, messages?: string[]) => {
  safeExit(() => {
    console.log(chalk.green(`${name} [${process.cwd()}]`))
    for (let i = 0; i < steps.length; i++) {
      const [command, args, config] = steps[i]
      if (messages?.[i]) {
        console.log(chalk.gray(messages?.[i]))
      }
      const status = spawnSync(command, Array.isArray(args) ? args : args.split(' '), {
        ...config,
        encoding: 'utf8',
        shell: true,
        stdio: 'inherit',
      }).status
      if (status && exitOnFail) {
        return status
      }
    }
  })
}
