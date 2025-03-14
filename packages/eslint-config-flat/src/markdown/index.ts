import type { Linter } from 'eslint'
import markdown from 'eslint-plugin-markdown'

import { ignores } from '../ignores.ts'

export const markdownConfig: Linter.Config = {
  ignores,
  plugins: { markdown },
  files: ['**/*.md'],
  processor: 'markdown/markdown',
}
