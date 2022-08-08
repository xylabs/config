module.exports = {
  extends: ['./typescript', './prettier', './import', './rules', './json', './markdown'],
  ignorePatterns: ['**/dist', '**/build', '**/bin', '**/node_modules', '**/package.json', '**/.*'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
}
