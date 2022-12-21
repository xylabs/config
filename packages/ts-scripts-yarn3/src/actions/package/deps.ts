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
    ignoreMatches = JSON.parse(`{${rawIgnore}}`).ignores as string[]
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
    console.log(chalk.yellow(`${unused.dependencies.length} Unused dependencies`))
    unused.dependencies.forEach((value) => console.warn(chalk.gray(`  ${value}`)))
  }

  if (unused.devDependencies.length) {
    console.log(chalk.yellow(`${unused.devDependencies.length} Unused devDependencies`))
    unused.devDependencies.forEach((value) => console.warn(chalk.gray(`  ${value}`)))
  }

  if (Object.entries(unused.invalidDirs).length) {
    console.log(chalk.yellow(`${Object.entries(unused.invalidDirs).length} Invalid Dirs`))
    Object.entries(unused.invalidDirs).forEach(([key, value]) => console.warn(chalk.gray(`${key}: ${value}`)))
  }

  if (Object.entries(unused.invalidFiles).length) {
    console.log(chalk.yellow(`${Object.entries(unused.invalidFiles).length} Invalid Files`))
    Object.entries(unused.invalidFiles).forEach(([key, value]) => console.warn(chalk.gray(`${key}: ${value}`)))
  }

  if (Object.entries(unused.missing).length) {
    console.log(chalk.yellow(`${Object.entries(unused.missing).length} Missing dependencies`))
    Object.entries(unused.missing).forEach(([key, value]) => {
      console.warn(chalk.gray(`${key}`))
      console.warn(`  ${value.pop()}`)
    })
  }

  return errorCount
}
