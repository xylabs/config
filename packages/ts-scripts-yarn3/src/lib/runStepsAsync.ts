import chalk from 'chalk'
import { spawn } from 'child_process'
import { existsSync } from 'fs'

import { ScriptStep } from './runSteps'

export const runStepAsync = (step: ScriptStep, interactive = false, message?: string) => {
  return new Promise<[number, string[]]>((resolve) => {
    const [command, args, config] = step
    if (message) {
      console.log(chalk.gray(message))
    }
    const argList = Array.isArray(args) ? args : args.split(' ')
    if (command === 'node' && !existsSync(argList[0])) {
      throw Error(`File not found [${argList[0]}]`)
    }
    const output: string[] = []
    spawn(command, Array.isArray(args) ? args : args.split(' '), {
      ...config,
      env: { FORCE_COLOR: '3', ...process.env },
      shell: true,
      stdio: interactive ? 'inherit' : undefined,
    })
      .on('exit', (code) => {
        if (code) {
          console.error(
            chalk.blue(
              `Command Exited With Non-Zero Result [${chalk.gray(code)}] | ${chalk.yellow(command)} ${chalk.white(
                Array.isArray(args) ? args.join(' ') : args,
              )}`,
            ),
          )
          resolve([code, output])
        } else {
          resolve([0, output])
        }
      })
      .stdout?.on('data', (data: Buffer) => {
        if (!interactive) {
          output.push(data.toString('utf8'))
        }
      })
  })
}

export const runStepsAsync = async (name: string, steps: ScriptStep[], exitOnFail = true, messages?: string[]) => {
  try {
    const pkgName = process.env.npm_package_name
    console.log(chalk.green(`${name} [${pkgName}]`))
    const result = (
      await Promise.all(
        steps
          .map<[ScriptStep, string | undefined]>((step, index) => [step, messages?.[index]])
          .map(([step, message], index) => runStepAsync(step, index === 0, message)),
      )
    ).reduce<[number, string[]]>((prev, value) => [prev[0] + value[0], [...prev[1], ...value[1]]], [0, []])
    console.log(result[1].join(''))
    if (exitOnFail && result[0]) {
      process.exit(result[0])
    }
    return result[0]
  } catch (ex) {
    console.error(chalk.red(ex))
    process.exit(-1)
  }
}
