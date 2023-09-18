import { ESLint } from 'eslint'

export const workspacesConfig: ESLint.ConfigData = {
  extends: ['plugin:workspaces/recommended'],
  plugins: ['workspaces'],
  rules: {
    'workspaces/no-relative-imports': ['off'],
    'workspaces/require-dependency': ['off'],
  },
}
