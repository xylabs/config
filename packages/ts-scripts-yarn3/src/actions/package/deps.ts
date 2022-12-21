import chalk from 'chalk'
import depcheck from 'depcheck'
import { existsSync, readFileSync } from 'fs'

export const packageDeps = async () => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name

  const rawIgnore = existsSync(`${pkg}/.depcheckrc`)
    ? readFileSync(`${pkg}/.depcheckrc`, { encoding: 'utf8' }).replace('ignores:', '"ignores":')
    : undefined
  let ignoreMatches: string[] = []
  try {
    ignoreMatches = rawIgnore ? (JSON.parse(`{${rawIgnore}}`).ignores as string[]) : []
  } catch (ex) {
    const error = ex as Error
    console.log(`${pkgName} [${error.message}] Failed to parse .depcheckrc [${rawIgnore}]`)
  }

  const unused = await depcheck(`${pkg}/.`, { ignoreMatches, ignorePatterns: ['*.stories.*', '*.spec.*', '*.d.ts', 'dist'] })

  const errorCount =
    unused.dependencies.length +
    unused.devDependencies.length +
    Object.entries(unused.invalidDirs).length +
    Object.entries(unused.invalidFiles).length +
    Object.entries(unused.missing).length

  if (errorCount > 0) {
    console.log(chalk.yellow(`Deps [${pkgName}] - Failed`))
  }

  if (unused.dependencies.length) {
    const message = [`${unused.dependencies.length} Unused dependencies`]
    unused.dependencies.forEach((value) => message.push(`  ${value}`))
    console.log(chalk.yellow(message.join('\n')))
  }

  if (unused.devDependencies.length) {
    const message = [`${unused.devDependencies.length} Unused devDependencies`]
    unused.devDependencies.forEach((value) => message.push(`  ${value}`))
    console.log(chalk.yellow(message.join('\n')))
  }

  if (Object.entries(unused.invalidDirs).length) {
    Object.entries(unused.invalidDirs).forEach(([key, value]) => console.warn(chalk.gray(`Invalid Dir: ${key}: ${value}`)))
  }

  if (Object.entries(unused.invalidFiles).length) {
    Object.entries(unused.invalidFiles).forEach(([key, value]) => console.warn(chalk.gray(`Invalid File: ${key}: ${value}`)))
  }

  if (Object.entries(unused.missing).length) {
    const message = [`${Object.entries(unused.missing).length} Missing dependencies`]
    Object.entries(unused.missing).forEach(([key, value]) => {
      message.push(chalk.gray(`${key}`))
      message.push(`  ${value.pop()}`)
    })
    console.log(chalk.yellow(message.join('\n')))
  }

  return errorCount
}
