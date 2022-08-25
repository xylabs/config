module.exports = {
  extends: ['plugin:workspaces/recommended'],
  plugins: ['workspaces'],
  rules: {
    'workspaces/no-relative-imports': ['off'],
    'workspaces/require-dependency': ['off'],
  },
}
