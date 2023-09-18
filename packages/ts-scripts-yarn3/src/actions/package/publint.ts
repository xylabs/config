import chalk from 'chalk'
import { promises as fs } from 'fs'
import { Message } from 'publint'

export interface PackagePublintParams {
  verbose?: boolean
}

export const packagePublint = async (params?: PackagePublintParams) => {
  const pkgDir = process.env.INIT_CWD

  if (params?.verbose) {
    console.log(chalk.gray(`Publint [Start]: ${pkgDir}`))
  }

  const pkg = JSON.parse(await fs.readFile(`${pkgDir}/package.json`, 'utf8'))

  const { publint } = await import('publint')

  const { messages } = await publint({
    level: 'suggestion',
    pkgDir,
    strict: true,
  })

  // eslint-disable-next-line import/no-internal-modules
  const { formatMessage } = await import('publint/utils')

  messages.forEach((message: Message) => {
    switch (message.type) {
      case 'error':
        console.error(chalk.red(formatMessage(message, pkg)))
        break
      case 'warning':
        console.warn(chalk.yellow(formatMessage(message, pkg)))
        break
      default:
        console.info(chalk.white(formatMessage(message, pkg)))
        break
    }
  })

  if (params?.verbose) {
    console.log(chalk.gray(`Publint [Finish]: ${pkgDir} [${messages.length}]`))
  }

  return messages.length
}
