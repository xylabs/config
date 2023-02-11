import chalk from 'chalk'
import { spawn } from 'child_process'
import { existsSync } from 'fs'

import { ScriptStep } from './runSteps'

export const runStepAsync = (step: ScriptStep, exitOnFail = true, message?: string) => {
  return new Promise((resolve) => {
    const [command, args, config] = step
    if (message) {
      console.log(chalk.gray(message))
    }
    const argList = Array.isArray(args) ? args : args.split(' ')
    if (command === 'node' && !existsSync(argList[0])) {
      throw Error(`File not found [${argList[0]}]`)
    }
    spawn(command, Array.isArray(args) ? args : args.split(' '), {
      ...config,
      env: { FORCE_COLOR: '3', ...process.env },
      shell: true,
      stdio: 'inherit',
    }).on('close', (code) => {
      if (code) {
        if (exitOnFail) {
          console.error(
            chalk.blue(
              `Command Exited With Non-Zero Result [${chalk.gray(code)}] | ${chalk.yellow(command)} ${chalk.white(
                Array.isArray(args) ? args.join(' ') : args,
              )}`,
            ),
          )
        }
        resolve(code)
      } else {
        resolve(0)
      }
    })
  })
}

export const runStepsAsync = async (name: string, steps: ScriptStep[], exitOnFail = true, messages?: string[]) => {
  try {
    const pkgName = process.env.npm_package_name
    console.log(chalk.green(`${name} [${pkgName}]`))
    for (let i = 0; i < steps.length; i++) {
      await runStepAsync(steps[i], exitOnFail, messages?.[i])
    }
    return 0
  } catch (ex) {
    console.error(chalk.red(ex))
    process.exit(-1)
  }
}
