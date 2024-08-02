/* eslint-disable max-statements */
import { existsSync, readFileSync } from 'node:fs'
import { cwd } from 'node:process'

import chalk from 'chalk'
import depcheck from 'depcheck'
const special = depcheck.special

import { checkResult } from '../../lib/index.ts'

const defaultIgnorePatterns = ['*.d.ts', 'dist', '.*', 'node_modules']
const defaultIgnoreDevDeps = [
  '@xylabs/ts-scripts-yarn3',
  '@xylabs/tsconfig',
  '@xylabs/tsconfig-dom',
  '@xylabs/tsconfig-react',
  '@xylabs/tsconfig-jest',
  'typescript',
]
const defaultIgnoreDevPatterns = ['*.stories.*', '*.spec.*', 'spec', 'stories', 'tsconfig.json']

const reportUnused = (name: string, unused: depcheck.Results['dependencies']) => {
  if (unused.length > 0) {
    const message = [chalk.yellow(`${unused.length} Unused ${name}`)]
    for (const value of unused) message.push(chalk.gray(`  ${value}`))
    console.log(message.join('\n'))
  }
}

const reportMissing = (name: string, missing: depcheck.Results['missing']) => {
  if (Object.keys(missing).length > 0) {
    const message = [chalk.yellow(`${Object.entries(missing).length} Missing ${name}`)]
    for (const [key, value] of Object.entries(missing)) {
      message.push(`${key}`, chalk.gray(`  ${value.at(0)}`))
    }
    console.log(chalk.yellow(message.join('\n')))
  }
}

const analyzeDeps = async (pkg: string, ignoreMatches: string[]) => {
  const packageContent = existsSync(`${pkg}/package.json`) ? JSON.parse(readFileSync(`${pkg}/package.json`, { encoding: 'utf8' })) : undefined
  const [srcUnused, allUnused] = await Promise.all([
    depcheck(`${pkg}/src`, {
      ignoreMatches,
      ignorePatterns: [...defaultIgnoreDevPatterns, ...defaultIgnorePatterns],
      package: packageContent,
    }),
    depcheck(`${pkg}/.`, {
      ignoreMatches: [...ignoreMatches, ...defaultIgnoreDevDeps],
      ignorePatterns: [...defaultIgnorePatterns],
      package: packageContent,
      specials: [special.eslint, special.babel, special.bin, special.prettier, special.jest, special.mocha],
    }),
  ])

  const unusedDeps = srcUnused.dependencies
  const unusedDevDeps = allUnused.devDependencies
  const usedDeps = srcUnused.using
  const usedDevDeps = allUnused.using
  const missing = { ...srcUnused.missing, ...allUnused.missing }
  const { invalidDirs, invalidFiles } = allUnused

  return { invalidDirs, invalidFiles, missing, unusedDeps, unusedDevDeps, usedDeps, usedDevDeps }
}

export const packageDeps = async () => {
  const pkg = process.env.INIT_CWD ?? cwd()
  const pkgName = process.env.npm_package_name

  const packageContent = existsSync(`${pkg}/package.json`) ? JSON.parse(readFileSync(`${pkg}/package.json`, { encoding: 'utf8' })) : undefined

  const rawIgnore =
    existsSync(`${pkg}/.depcheckrc`) ? readFileSync(`${pkg}/.depcheckrc`, { encoding: 'utf8' }).replace('ignores:', '"ignores":') : undefined
  let ignoreMatches: string[] = []
  try {
    ignoreMatches = rawIgnore ? (JSON.parse(`{${rawIgnore}}`).ignores as string[]) : []
  } catch (ex) {
    const error = ex as Error
    console.log(`${pkgName} [${error.message}] Failed to parse .depcheckrc [${rawIgnore}]`)
  }

  const { invalidDirs, invalidFiles, unusedDeps, unusedDevDeps, usedDeps, usedDevDeps, missing } = await analyzeDeps(pkg, ignoreMatches)

  const declaredDeps = Object.keys(packageContent.dependencies ?? {})
  const declaredPeerDeps = Object.keys(packageContent.peerDependencies ?? {})
  const declaredDevDeps = Object.keys(packageContent.devDependencies ?? {})

  const missingDeps = Object.keys(usedDeps).filter(
    (key) => !declaredDeps.includes(key) && !declaredPeerDeps.includes(key) && !key.startsWith('@types/'),
  )

  const missingDevDeps = Object.keys(usedDevDeps).filter((key) => !declaredDevDeps.includes(key) && !declaredDeps.includes(key))

  const missingDepsObject: Record<string, string[]> = {}
  for (const key of missingDeps) {
    missingDepsObject[key] = missing[key] ?? [`devDep should be dep [${key}]`]
  }

  const missingDevDepsObject: Record<string, string[]> = {}
  for (const key of missingDevDeps) {
    if (missing[key]) {
      missingDevDepsObject[key] = missing[key]
    }
  }

  const errorCounts = [
    unusedDeps.length,
    unusedDevDeps.length,
    Object.entries(invalidDirs).length,
    Object.entries(invalidFiles).length,
    Object.entries(missingDepsObject).length,
    Object.entries(missingDevDepsObject).length,
  ]

  const errorCount = errorCounts.reduce((prev, count) => prev + count, 0)

  if (errorCount > 0) {
    console.log(`Deps [${pkgName}] = (${JSON.stringify(errorCounts)})`)
  } else {
    console.log(`Deps [${pkgName}] - Ok`)
  }

  reportUnused('dependencies', unusedDeps)
  reportUnused('devDependencies', unusedDevDeps)

  if (Object.entries(invalidDirs).length > 0) {
    for (const [key, value] of Object.entries(invalidDirs)) console.warn(chalk.gray(`Invalid Dir: ${key}: ${value}`))
  }

  if (Object.entries(invalidFiles).length > 0) {
    for (const [key, value] of Object.entries(invalidFiles)) console.warn(chalk.gray(`Invalid File: ${key}: ${value}`))
  }

  reportMissing('dependencies', missingDepsObject)
  reportMissing('devDependencies', missingDevDepsObject)

  checkResult(`Deps [${pkgName}]`, errorCount, 'warn', false)

  //returning 0 here since we never want deps to be fatal
  return 0
}
