import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

import chalk from 'chalk'

import { checkResult } from './checkResult'
import { ScriptStep } from './runSteps'
import { safeExitAsync } from './safeExit'

export const runStepAsync = (name: string, step: ScriptStep, exitOnFail = true, message?: string) => {
  return new Promise<number>((resolve) => {
    const [command, args, config] = step
    if (message) {
      console.log(chalk.gray(message))
    }
    const argList = Array.isArray(args) ? args : args.split(' ')
    if (command === 'node' && !existsSync(argList[0])) {
      throw new Error(`File not found [${argList[0]}]`)
    }
    spawn(command, Array.isArray(args) ? args : args.split(' '), {
      ...config,
      env: { FORCE_COLOR: '3', ...process.env },
      shell: true,
      stdio: 'inherit',
    }).on('close', (code) => {
      if (code) {
        console.error(
          chalk.red(
            `Command Exited With Non-Zero Result [${chalk.gray(code)}] | ${chalk.yellow(command)} ${chalk.white(
              Array.isArray(args) ? args.join(' ') : args,
            )}`,
          ),
        )
        checkResult(name, code, 'error', exitOnFail)
        resolve(code)
      } else {
        resolve(0)
      }
    })
  })
}

export const runStepsAsync = async (name: string, steps: ScriptStep[], exitOnFail = true, messages?: string[]) => {
  return await safeExitAsync(async () => {
    const pkgName = process.env.npm_package_name
    console.log(chalk.green(`${name} [${pkgName}]`))
    let result = 0
    for (const [i, step] of steps.entries()) {
      result += await runStepAsync(name, step, exitOnFail, messages?.[i])
    }
    return result
  })
}
