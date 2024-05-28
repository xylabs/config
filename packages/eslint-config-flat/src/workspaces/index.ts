import { Linter } from 'eslint'
import workspaces from 'eslint-plugin-workspaces'

export const workspacesConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'build/**', 'node_modules/**'],
  plugins: {workspaces},
  rules: {
    ...workspaces.configs.recommended.rules,
    'workspaces/no-relative-imports': ['off'],
    'workspaces/require-dependency': ['off'],
  },
}
