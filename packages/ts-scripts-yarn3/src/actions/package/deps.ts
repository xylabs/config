import chalk from 'chalk'
import depcheck, { special } from 'depcheck'
import { existsSync, readFileSync } from 'fs'

import { checkResult } from '../../lib'

const andStringArrays = (arrays: [string[], string[]]): string[] => {
  return arrays[0].filter((value) => arrays[1].includes(value))
}

const reportUnused = (name: string, unused: depcheck.Results['dependencies']) => {
  if (unused.length) {
    const message = [chalk.yellow(`${unused.length} Unused ${name}`)]
    unused.forEach((value) => message.push(chalk.gray(`  ${value}`)))
    console.log(message.join('\n'))
  }
}

const reportMissing = (name: string, missing: depcheck.Results['missing']) => {
  if (missing.length) {
    const message = [chalk.yellow(`${Object.entries(missing).length} Missing ${name}`)]
    Object.entries(missing).forEach(([key, value]) => {
      message.push(`${key}`)
      message.push(chalk.gray(`  ${value.pop()}`))
    })
    console.log(chalk.yellow(message.join('\n')))
  }
}

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

  const defaultIgnorePatterns = ['*.d.ts', 'dist', '.*', 'node_modules']
  const defaultIgnoreMatches = [
    '@xylabs/ts-scripts-yarn3',
    '@xylabs/tsconfig',
    '@xylabs/tsconfig-dom',
    '@xylabs/tsconfig-react',
    '@xylabs/tsconfig-jest',
    'typescript',
  ]

  const [srcUnused, allUnused] = await Promise.all([
    depcheck(`${pkg}/src`, {
      ignoreMatches: [...defaultIgnoreMatches, ...ignoreMatches],
      ignorePatterns: ['*.stories.*', '*.spec.*', 'spec', ...defaultIgnorePatterns],
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
    ...srcUnused,
    /* we only reports the unused devDeps if both src or other are not using it */
    devDependencies: andStringArrays([allUnused.devDependencies, srcUnused.devDependencies]),
  }

  const declaredDeps = Object.keys(packageContent.dependencies ?? {})
  const declaredPeerDeps = Object.keys(packageContent.peerDependencies ?? {})

  const missingDeps = Object.keys(srcUnused.using).filter(
    (key) => !declaredDeps.includes(key) && !declaredPeerDeps.includes(key) && !key.startsWith('@types/') && !defaultIgnoreMatches.includes(key),
  )

  const errorCount =
    unused.dependencies.length +
    unused.devDependencies.length +
    Object.entries(unused.invalidDirs).length +
    Object.entries(unused.invalidFiles).length +
    missingDeps.length

  if (errorCount > 0) {
    console.log(`Deps [${pkgName}]`)
  } else {
    console.log(`Deps [${pkgName}] - Ok`)
  }

  reportUnused('dependencies', unused.dependencies)
  reportUnused('devDependencies', unused.devDependencies)

  if (Object.entries(unused.invalidDirs).length) {
    Object.entries(unused.invalidDirs).forEach(([key, value]) => console.warn(chalk.gray(`Invalid Dir: ${key}: ${value}`)))
  }

  if (Object.entries(unused.invalidFiles).length) {
    Object.entries(unused.invalidFiles).forEach(([key, value]) => console.warn(chalk.gray(`Invalid File: ${key}: ${value}`)))
  }

  const missingDepsObject = Object.entries(srcUnused.missing).reduce(
    (prev, [key, value]) => (missingDeps.includes(key) ? { ...prev, ...{ [key]: value } } : prev),
    {},
  )

  reportMissing('dependencies', missingDepsObject)
  reportMissing('devDependencies', allUnused.missing)

  checkResult(`Deps [${pkgName}]`, errorCount, 'warn', false)

  //returning 0 here since we never want deps to be fatal
  return 0
}
