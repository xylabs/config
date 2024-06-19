import { Linter } from 'eslint'
import mdPlugin from 'eslint-plugin-md'

export const markdownConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  files: ['*.md'],
  processor: 'md/markdown',
  plugins: { md: mdPlugin },
  rules: {
    'md/remark': [
      'warn',
      {
        plugins: ['preset-lint-markdown-style-guide', 'frontmatter', ['lint-list-item-indent', 'tab-size']],
      },
    ],
    'prettier/prettier': [
      'off',
      // Important to force prettier to use "markdown" parser - otherwise it wouldn't be able to parse *.md files.
      // You also can configure other options supported by prettier here - "prose-wrap" is
      // particularly useful for *.md files
      { parser: 'markdown' },
    ],
  },
}
