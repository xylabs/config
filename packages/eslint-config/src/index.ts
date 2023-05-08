import { cwd } from 'process'

module.exports = {
  extends: ['./typescript', './prettier', './import', './rules', './json', './markdown', './workspaces'],
  ignorePatterns: ['node_modules', 'build', 'dist', 'bin', 'storybook-static', '.*', 'package.json'],
  parserOptions: { tsconfigRootDir: cwd() },
}
