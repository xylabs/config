import { ESLint, Linter } from 'eslint'
import workspacesPlugin from 'eslint-plugin-workspaces'

export const workspacesConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  plugins: { workspaces: workspacesPlugin as ESLint.Plugin },
  rules: {
    ...(workspacesPlugin.configs.recommended as ESLint.ConfigData).rules,
    'workspaces/no-relative-imports': ['off'],
    'workspaces/require-dependency': ['off'],
  },
}
