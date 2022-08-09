module.exports = {
  extends: ['./typescript', './prettier', './import', './rules', './json', './markdown'],
  ignorePatterns: ['**/dist', '**/build', '**/bin', '**/node_modules', '**/package.json', '**/.*', '*.js*', '**/storybook-static'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
}
