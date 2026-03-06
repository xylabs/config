import {
  existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync,
} from 'node:fs'
import PATH from 'node:path'

import chalk from 'chalk'

import {
  claudeMdProjectTemplate, claudeMdRuleTemplates, XYLABS_RULES_PREFIX,
} from '../lib/index.ts'
import { INIT_CWD } from '../lib/yarn/index.ts'

const syncRuleFiles = (rulesDir: string) => {
  const templates = claudeMdRuleTemplates()
  const templateNames = new Set(Object.keys(templates))
  let updated = 0
  let created = 0

  for (const [filename, content] of Object.entries(templates)) {
    const targetPath = PATH.resolve(rulesDir, filename)
    const existing = existsSync(targetPath) ? readFileSync(targetPath, 'utf8') : undefined
    if (existing === content) continue
    writeFileSync(targetPath, content, 'utf8')
    if (existing) {
      updated++
    } else {
      created++
    }
  }

  return {
    created, templateNames, updated,
  }
}

const removeStaleRules = (rulesDir: string, templateNames: Set<string>) => {
  const existingRules = readdirSync(rulesDir).filter(f => f.startsWith(XYLABS_RULES_PREFIX) && f.endsWith('.md'))
  let removed = 0

  for (const file of existingRules) {
    if (!templateNames.has(file)) {
      unlinkSync(PATH.resolve(rulesDir, file))
      removed++
    }
  }

  return removed
}

const logRulesResult = (created: number, updated: number, removed: number) => {
  if (created || updated || removed) {
    const parts = [
      created ? `${created} created` : '',
      updated ? `${updated} updated` : '',
      removed ? `${removed} removed` : '',
    ].filter(Boolean)
    console.log(chalk.green(`.claude/rules/${XYLABS_RULES_PREFIX}*.md: ${parts.join(', ')}`))
  } else {
    console.log(chalk.gray(`.claude/rules/${XYLABS_RULES_PREFIX}*.md: already up to date`))
  }
}

const ensureProjectClaudeMd = (cwd: string, force?: boolean) => {
  const projectPath = PATH.resolve(cwd, 'CLAUDE.md')

  if (!existsSync(projectPath) || force) {
    if (force && existsSync(projectPath)) {
      console.log(chalk.yellow('Overwriting existing CLAUDE.md'))
    }
    writeFileSync(projectPath, claudeMdProjectTemplate(), 'utf8')
    console.log(chalk.green('Generated CLAUDE.md'))
  } else {
    console.log(chalk.gray('CLAUDE.md already exists (skipped)'))
  }
}

export const claudeRules = ({ force }: { force?: boolean } = {}): number => {
  const cwd = INIT_CWD() ?? process.cwd()
  const rulesDir = PATH.resolve(cwd, '.claude', 'rules')

  mkdirSync(rulesDir, { recursive: true })

  const {
    created, templateNames, updated,
  } = syncRuleFiles(rulesDir)
  const removed = removeStaleRules(rulesDir, templateNames)
  logRulesResult(created, updated, removed)
  ensureProjectClaudeMd(cwd, force)

  return 0
}
