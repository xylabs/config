import { promises as fs } from 'node:fs'

import chalk from 'chalk'
import sortPackageJson from 'sort-package-json'

export interface PackagePublintParams { strict?: boolean; verbose?: boolean }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customPubLint = (pkg: any): [number, number] => {
  let errorCount = 0
  let warningCount = 0
  if (pkg.files === undefined) {
    console.warn(chalk.yellow('Publint [custom]: "files" field is missing'))
    warningCount++
  }
  if (pkg.main !== undefined) {
    console.warn(chalk.yellow('Publint [custom]: "main" field is deprecated, use "exports" instead'))
    warningCount++
  }
  if (pkg.sideEffects !== false) {
    console.warn(chalk.yellow('Publint [custom]: "sideEffects" field should be set to false'))
    warningCount++
  }
  if (pkg.resolutions !== undefined) {
    console.warn(chalk.yellow('Publint [custom]: "resolutions" in use'))
    console.warn(chalk.gray(JSON.stringify(pkg.resolutions, null, 2)))
    warningCount++
  }
  return [errorCount, warningCount]
}

export const packagePublint = async ({ strict = true, verbose = false }: PackagePublintParams = {}) => {
  const pkgDir = process.env.INIT_CWD

  const sortedPkg = sortPackageJson(await fs.readFile(`${pkgDir}/package.json`, 'utf8'))
  await fs.writeFile(`${pkgDir}/package.json`, sortedPkg)

  const pkg = JSON.parse(await fs.readFile(`${pkgDir}/package.json`, 'utf8'))

  console.log(chalk.green(`Publint: ${pkg.name}`))
  console.log(chalk.gray(pkgDir))

  const { publint } = await import('publint')

  const { messages } = await publint({
    level: 'suggestion',
    pkgDir,
    strict,
  })

  // eslint-disable-next-line import-x/no-internal-modules
  const { formatMessage } = await import('publint/utils')

  for (const message of messages) {
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

  const [errorCount, warningCount] = customPubLint(pkg)

  if (verbose) {
    console.log(chalk.gray(`Publint [Finish]: ${pkgDir} [${messages.length + errorCount + warningCount} messages]`))
  }

  return messages.filter(message => message.type === 'error').length + errorCount
}
