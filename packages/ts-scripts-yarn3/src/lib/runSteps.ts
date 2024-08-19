import type { SpawnSyncOptionsWithBufferEncoding } from 'node:child_process'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

import chalk from 'chalk'

import { checkResult } from './checkResult.ts'
import { safeExit } from './safeExit.ts'

export type ScriptStep =
  | [/* command */ 'yarn' | 'node' | 'ts-node-script' | 'tsc' | 'jest', /* arg */ string | string[]]
  | [/* command */ string, /* arg */ string | string[], /* config */ SpawnSyncOptionsWithBufferEncoding]

export const runSteps = (name: string, steps: ScriptStep[], exitOnFail = true, messages?: string[]): number => {
  return safeExit(() => {
    const pkgName = process.env.npm_package_name
    console.log(chalk.green(`${name} [${pkgName}]`))
    let totalStatus = 0
    for (const [i, [command, args, config]] of steps.entries()) {
      if (messages?.[i]) {
        console.log(chalk.gray(messages?.[i]))
      }
      const argList = Array.isArray(args) ? args : args.split(' ')
      if (command === 'node' && !existsSync(argList[0])) {
        throw new Error(`File not found [${argList[0]}]`)
      }
      const status
        = spawnSync(command, Array.isArray(args) ? args : args.split(' '), {
          ...config,
          encoding: 'utf8',
          env: { FORCE_COLOR: '3', ...process.env },
          shell: true,
          stdio: 'inherit',
        }).status ?? 0
      checkResult(name, status, 'error', exitOnFail)
      totalStatus += status ?? 0
    }
    return totalStatus
  }, !!exitOnFail)
}
