import { ESLint } from "eslint";

export const markdownConfig: ESLint.ConfigData = {
  extends: ['plugin:md/recommended'],
  overrides: [
    {
      files: ['*.md'],
      parser: 'markdown-eslint-parser',
      rules: {
        'md/remark': [
          'error',
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
    },
  ],
}
