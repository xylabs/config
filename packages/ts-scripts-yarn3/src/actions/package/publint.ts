import { promises as fs } from 'node:fs'

import chalk from 'chalk'
import { Message } from 'publint'

export interface PackagePublintParams {
  verbose?: boolean
}

export const packagePublint = async (params?: PackagePublintParams) => {
  const pkgDir = process.env.INIT_CWD
  const pkg = JSON.parse(await fs.readFile(`${pkgDir}/package.json`, 'utf8'))

  console.log(chalk.green(`Publint: ${pkg.name}`))
  console.log(chalk.gray(pkgDir))

  const { publint } = await import('publint')

  const { messages } = await publint({
    level: 'suggestion',
    pkgDir,
    strict: true,
  })

  // eslint-disable-next-line import/no-internal-modules
  const { formatMessage } = await import('publint/utils')

  const validMessage = (_message: Message): boolean => {
    return true
    /* try {
      const value = getValueFromPath(pkg, message.path)
      switch (message.code) {
        case 'FILE_INVALID_FORMAT':
          return !message.args?.actualFilePath?.includes('dist/browser') && !value?.includes('dist/browser')
        case 'EXPORT_TYPES_INVALID_FORMAT':
          return !`${value}`.includes('dist/browser')
        default:
          return true
      }
    } catch (ex) {
      const error = ex as Error
      console.error(chalk.red(`validMessage Excepted: ${error.message}`))
      console.error(chalk.gray(JSON.stringify(error.stack)))
      return true
    } */
  }

  // we filter out invalid file formats for the esm folder since it is intentionally done
  const validMessages = messages.filter(validMessage)
  for (const message of validMessages) {
    switch (message.type) {
      case 'error': {
        console.error(chalk.red(`[${message.code}] ${formatMessage(message, pkg)}`))
        break
      }
      case 'warning': {
        console.warn(chalk.yellow(`[${message.code}] ${formatMessage(message, pkg)}`))
        break
      }
      default: {
        console.log(chalk.white(`[${message.code}] ${formatMessage(message, pkg)}`))
        break
      }
    }
  }

  if (params?.verbose) {
    console.log(chalk.gray(`Publint [Finish]: ${pkgDir} [${validMessages.length}]`))
  }

  return validMessages.filter(message => message.type === 'error').length
}
