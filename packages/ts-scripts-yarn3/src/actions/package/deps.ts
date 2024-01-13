/* eslint-disable max-statements */
import chalk from 'chalk'
import depcheck, { special } from 'depcheck'
import { existsSync, readFileSync } from 'fs'

import { checkResult } from '../../lib'

const defaultIgnorePatterns = ['*.d.ts', 'dist', '.*', 'node_modules']
const defaultIgnoreDevDeps = [
  '@xylabs/ts-scripts-yarn3',
  '@xylabs/tsconfig',
  '@xylabs/tsconfig-dom',
  '@xylabs/tsconfig-react',
  '@xylabs/tsconfig-jest',
  'typescript',
]

const reportUnused = (name: string, unused: depcheck.Results['dependencies']) => {
  if (unused.length) {
    const message = [chalk.yellow(`${unused.length} Unused ${name}`)]
    unused.forEach((value) => message.push(chalk.gray(`  ${value}`)))
    console.log(message.join('\n'))
  }
}

const reportMissing = (name: string, missing: depcheck.Results['missing']) => {
  if (Object.keys(missing).length) {
    const message = [chalk.yellow(`${Object.entries(missing).length} Missing ${name}`)]
    Object.entries(missing).forEach(([key, value]) => {
      message.push(`${key}`)
      message.push(chalk.gray(`  ${value.at(0)}`))
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

  const [srcUnused, allUnused] = await Promise.all([
    depcheck(`${pkg}/src`, {
      ignoreMatches: ignoreMatches,
      ignorePatterns: ['*.stories.*', '*.spec.*', 'spec', ...defaultIgnorePatterns],
      package: packageContent,
    }),
    depcheck(`${pkg}/.`, {
      ignoreMatches: ignoreMatches,
      ignorePatterns: [...defaultIgnorePatterns],
      package: packageContent,
      specials: [special.eslint, special.babel, special.bin, special.prettier, special.jest, special.mocha],
    }),
  ])

  const unusedDeps = srcUnused.dependencies
  const unusedDevDeps = allUnused.devDependencies
  const usedDeps = srcUnused.using
  const usedDevDeps = allUnused.using

  const { invalidDirs, invalidFiles } = allUnused

  const declaredDeps = Object.keys(packageContent.dependencies ?? {})
  const declaredPeerDeps = Object.keys(packageContent.peerDependencies ?? {})
  const declaredDevDeps = Object.keys(packageContent.devDependencies ?? {})

  const missingDeps = Object.keys(usedDeps).filter(
    (key) => !declaredDeps.includes(key) && !declaredPeerDeps.includes(key) && !key.startsWith('@types/'),
  )

  const missingDevDeps = Object.keys(usedDevDeps).filter(
    (key) => !declaredDevDeps.includes(key) && !declaredDeps.includes(key) && !defaultIgnoreDevDeps.includes(key),
  )

  const missingDepsObject: Record<string, string[]> = {}
  missingDeps.forEach((key) => {
    missingDepsObject[key] = srcUnused.missing[key]
  })

  const missingDevDepsObject: Record<string, string[]> = {}
  missingDevDeps.forEach((key) => {
    missingDevDepsObject[key] = allUnused.missing[key]
  })

  const errorCount =
    unusedDeps.length +
    unusedDevDeps.length +
    Object.entries(invalidDirs).length +
    Object.entries(invalidFiles).length +
    Object.entries(missingDepsObject).length

  if (errorCount > 0) {
    console.log(`Deps [${pkgName}]`)
  } else {
    console.log(`Deps [${pkgName}] - Ok`)
  }

  reportUnused('dependencies', unusedDeps)
  reportUnused('devDependencies', unusedDevDeps)

  if (Object.entries(invalidDirs).length) {
    Object.entries(invalidDirs).forEach(([key, value]) => console.warn(chalk.gray(`Invalid Dir: ${key}: ${value}`)))
  }

  if (Object.entries(invalidFiles).length) {
    Object.entries(invalidFiles).forEach(([key, value]) => console.warn(chalk.gray(`Invalid File: ${key}: ${value}`)))
  }

  reportMissing('dependencies', missingDepsObject)
  reportMissing('devDependencies', allUnused.missing)

  checkResult(`Deps [${pkgName}]`, errorCount, 'warn', false)

  //returning 0 here since we never want deps to be fatal
  return 0
}
