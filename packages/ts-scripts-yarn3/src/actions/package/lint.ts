import { readdirSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { pathToFileURL } from 'node:url'

import chalk from 'chalk'
import { ESLint } from 'eslint'
import { findUp } from 'find-up'

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

export const packageLint = async () => {
  const configPath = await getRootESLintConfig()
  const { default: eslintConfig } = await import(configPath.href)

  // List of folders to ignore
  const ignoreFolders = new Set(['node_modules', 'dist', 'packages'])

  function getFiles(dir: string, ignorePatterns: string[]): string[] {
    return readdirSync(dir, { withFileTypes: true })
      .flatMap((dirent) => {
        const res = path.resolve(dir, dirent.name)

        // Exclude ignored paths
        if (ignorePatterns.some(pattern => res.includes(pattern))) return []

        return dirent.isDirectory() ? getFiles(res, ignorePatterns) : (res.endsWith('.ts') || res.endsWith('.tsx')) ? [res] : []
      })
  }

  const engine = new ESLint({ baseConfig: [...eslintConfig] })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ignorePatterns = [...eslintConfig.find((cfg: any) => cfg.ignores)?.ignores ?? [], ...ignoreFolders]

  const lintResults = await engine.lintFiles(getFiles(cwd(), ignorePatterns))

  dumpMessages(lintResults)

  return lintResults.reduce((prev, lintResult) => prev + lintResult.errorCount, 0)
}
