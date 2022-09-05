import chalk from 'chalk'
import { spawnSync, SpawnSyncOptionsWithBufferEncoding } from 'child_process'
import { existsSync } from 'fs'

import { safeExit } from './safeExit'

export type ScriptStep =
  | [/*command*/ 'yarn' | 'node' | 'ts-node-script' | 'tsc', /*arg*/ string | string[]]
  | [/*command*/ string, /*arg*/ string | string[], /*config*/ SpawnSyncOptionsWithBufferEncoding]

export const runSteps = (name: string, steps: ScriptStep[], exitOnFail = true, messages?: string[]) => {
  return safeExit(() => {
    const pkgName = process.env.npm_package_name
    console.log(chalk.green(`${name} [${pkgName}]`))
    for (let i = 0; i < steps.length; i++) {
      const [command, args, config] = steps[i]
      if (messages?.[i]) {
        console.log(chalk.gray(messages?.[i]))
      }
      const argList = Array.isArray(args) ? args : args.split(' ')
      if (command === 'node' && !existsSync(argList[0])) {
        throw Error(`File not found [${argList[0]}]`)
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
    return 0
  })
}
