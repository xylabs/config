module.exports = {
  extends: ['plugin:workspaces/recommended'],
  plugins: ['workspaces'],
  rules: {
    'workspaces/no-cross-imports': 'warn',
  },
}
