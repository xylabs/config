import { readdirSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { pathToFileURL } from 'node:url'

import chalk from 'chalk'
import { ESLint } from 'eslint'
import { findUp } from 'find-up'
import picomatch from 'picomatch'

const dumpMessages = (lintResults: ESLint.LintResult[]) => {
  const colors: ('white' | 'red' | 'yellow')[] = ['white', 'yellow', 'red']
  const severity: string[] = ['none', 'warning', 'error']

  for (const lintResult of lintResults) {
    if (lintResult.messages.length > 0) {
      console.log(chalk.gray(`\n${lintResult.filePath}`))
      for (const message of lintResult.messages) {
        console.log(
          chalk.gray(`\t${message.line}:${message.column}`),
          chalk[colors[message.severity]](`\t${severity[message.severity]}`),
          chalk.white(`\t${message.message}`),
          chalk.gray(`\t${message.ruleId}`),
        )
      }
    }
  }
}

async function getRootESLintConfig() {
  // Locate the root eslint.config.mjs
  const configPath = await findUp('eslint.config.mjs')

  if (!configPath) {
    throw new Error('eslint.config.mjs not found in the monorepo')
  }

  return pathToFileURL(configPath)
}

function getFiles(dir: string, ignoreFolders: string[]): string[] {
  const currentDirectory = cwd()
  const subDirectory = dir.split(currentDirectory)[1]
  if (ignoreFolders.includes(subDirectory)) return []
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent) => {
      const res = path.resolve(dir, dirent.name)
      const relativePath = subDirectory ? `${subDirectory}/${dirent.name}` : dirent.name

      const ignoreMatchers = ignoreFolders.map(pattern => picomatch(pattern))

      // Exclude ignored paths
      if (ignoreMatchers.some(isMatch => isMatch(relativePath))) return []

      return dirent.isDirectory()
        ? getFiles(res, ignoreFolders)
        : [res]
    })
}

export const packageLint = async (fix = false, verbose = false, cache = true) => {
  const start = Date.now()
  const pkg = process.env.INIT_CWD
  const configPath = await getRootESLintConfig()
  const { default: eslintConfig } = await import(configPath.href)

  // List of folders to ignore
  const ignoreFolders = ['node_modules', 'dist', 'packages', '.git', 'build', '.yarn', '.vscode', '.github']

  const engine = new ESLint({
    baseConfig: [...eslintConfig], fix, warnIgnored: false, cache,
  })

  const files = getFiles(cwd(), ignoreFolders)
  if (verbose) {
    console.log(chalk.green(`Linting ${pkg} [files = ${files.length}]`))
  }
  const lintResults = await engine.lintFiles(files)

  dumpMessages(lintResults)

  if (fix) {
    await ESLint.outputFixes(lintResults)
  }
  console.log(chalk.green(`Linted ${files.length} files in ${Date.now() - start}ms`))
  return lintResults.reduce((prev, lintResult) => prev + lintResult.errorCount, 0)
}
