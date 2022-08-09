import { cwd } from 'process'

module.exports = {
  extends: ['./typescript', './prettier', './import', './rules', './json', './markdown'],
  ignorePatterns: ['/dist', '/build', '/bin', '/node_modules', 'package.json', '/.yarn'],
  parserOptions: { tsconfigRootDir: cwd() },
}
