import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import PATH from 'node:path'

const require = createRequire(import.meta.url)
const packageRoot = PATH.dirname(require.resolve('@xylabs/ts-scripts-yarn3/package.json'))
const templatesDir = PATH.resolve(packageRoot, 'templates')

export const XYLABS_RULES_PREFIX = 'xylabs-'

export const claudeMdRuleTemplates = (): Record<string, string> => {
  const rulesDir = PATH.resolve(templatesDir, 'rules')
  const files = readdirSync(rulesDir).filter(f => f.startsWith(XYLABS_RULES_PREFIX) && f.endsWith('.md'))
  const result: Record<string, string> = {}
  for (const file of files) {
    result[file] = readFileSync(PATH.resolve(rulesDir, file), 'utf8')
  }
  return result
}

export const claudeMdProjectTemplate = (): string =>
  readFileSync(PATH.resolve(templatesDir, 'CLAUDE-project.md'), 'utf8')
