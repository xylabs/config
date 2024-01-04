/* eslint-disable max-statements */
import chalk from 'chalk'
import depcheck, { special } from 'depcheck'
import { existsSync, readFileSync } from 'fs'

import { checkResult } from '../../lib'

export const packageDeps = async () => {
  const pkg = process.env.INIT_CWD
  const pkgName = process.env.npm_package_name

  const packageContent = existsSync(`${pkg}/package.json`) ? JSON.parse(readFileSync(`${pkg}/package.json`, { encoding: 'utf8' })) : undefined

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

  const defaultIgnorePatterns = ['*.d.ts', 'dist', '.*']
  const defaultIgnoreMatches = [
    '@xylabs/ts-scripts-yarn3',
    '@xylabs/tsconfig',
    '@xylabs/tsconfig-dom',
    '@xylabs/tsconfig-react',
    '@xylabs/tsconfig-jest',
    'typescript',
  ]

  const [codeResults, testsResults] = await Promise.all([
    depcheck(`${pkg}/src`, {
      ignoreMatches: [...defaultIgnoreMatches, ...ignoreMatches],
      ignorePatterns: ['*.stories.*', '*.spec.*', ...defaultIgnorePatterns],
      package: packageContent,
    }),
    depcheck(`${pkg}/.`, {
      ignoreMatches: [...defaultIgnoreMatches, ...ignoreMatches],
      ignorePatterns: [...defaultIgnorePatterns],
      package: packageContent,
      specials: [special.eslint, special.babel, special.bin, special.prettier, special.jest, special.mocha],
    }),
  ])

  const unused: depcheck.Results = {
    ...codeResults,
    /* we only reports the unused devDeps if both are not using it */
    devDependencies: testsResults.devDependencies.filter((value) => codeResults.devDependencies.includes(value)),
  }

  const errorCount =
    unused.dependencies.length +
    unused.devDependencies.length +
    Object.entries(unused.invalidDirs).length +
    Object.entries(unused.invalidFiles).length +
    Object.entries(unused.missing).length

  if (errorCount > 0) {
    console.log(`Deps [${pkgName}]`)
  } else {
    console.log(`Deps [${pkgName}] - Ok`)
  }

  if (unused.dependencies.length) {
    const message = [chalk.yellow(`${unused.dependencies.length} Unused dependencies`)]
    unused.dependencies.forEach((value) => message.push(chalk.gray(`  ${value}`)))
    console.log(message.join('\n'))
  }

  if (unused.devDependencies.length) {
    const message = [chalk.yellow(`${unused.devDependencies.length} Unused devDependencies`)]
    unused.devDependencies.forEach((value) => message.push(chalk.gray(`  ${value}`)))
    console.log(message.join('\n'))
  }

  if (Object.entries(unused.invalidDirs).length) {
    Object.entries(unused.invalidDirs).forEach(([key, value]) => console.warn(chalk.gray(`Invalid Dir: ${key}: ${value}`)))
  }

  if (Object.entries(unused.invalidFiles).length) {
    Object.entries(unused.invalidFiles).forEach(([key, value]) => console.warn(chalk.gray(`Invalid File: ${key}: ${value}`)))
  }

  const declaredDeps = Object.keys(packageContent.dependencies ?? {})

  const missingDeps = Object.keys(codeResults.using).filter(
    (key) => !declaredDeps.includes(key) && !key.startsWith('@types/') && !defaultIgnoreMatches.includes(key),
  )

  if (Object.entries(codeResults.missing).length) {
    const message = [chalk.yellow(`${Object.entries(codeResults.missing).length} Missing dependencies`)]
    Object.entries(codeResults.missing).forEach(([key, value]) => {
      message.push(`${key}`)
      message.push(chalk.gray(`  ${value.pop()}`))
    })
    console.log(chalk.yellow(message.join('\n')))
  }

  if (missingDeps.length) {
    const message = [chalk.yellow(`${missingDeps.length} Missing dependencies [alt]`)]
    missingDeps.forEach((key) => {
      message.push(`${key}`)
      message.push(chalk.gray(`  ${codeResults.using[key].pop()}`))
    })
    console.log(chalk.yellow(message.join('\n')))
  }

  if (Object.entries(testsResults.missing).length) {
    const message = [chalk.yellow(`${Object.entries(testsResults.missing).length} Missing devDependencies`)]
    Object.entries(testsResults.missing).forEach(([key, value]) => {
      message.push(`${key}`)
      message.push(chalk.gray(`  ${value.pop()}`))
    })
    console.log(chalk.yellow(message.join('\n')))
  }

  checkResult(`Deps [${pkgName}]`, errorCount, 'warn', false)

  //returning 0 here since we never want deps to be fatal
  return 0
}
