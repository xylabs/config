import type { ESLint, Linter } from 'eslint'
import workspacesPlugin from 'eslint-plugin-workspaces'

export const workspacesConfig: Linter.Config = {
  plugins: { workspaces: workspacesPlugin as ESLint.Plugin },
  rules: {
    ...(workspacesPlugin.configs.recommended as ESLint.ConfigData).rules,
    'workspaces/no-relative-imports': ['off'],
    'workspaces/require-dependency': ['off'],
  },
}
