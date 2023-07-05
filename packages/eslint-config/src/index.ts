import { cwd } from 'process'

module.exports = {
  extends: ['./typescript', './prettier', './import', './rules', './json', './markdown', './workspaces'],
  ignorePatterns: ['node_modules', 'build', 'dist', 'docs', 'bin', 'storybook-static', '.*', 'package.json'],
  parserOptions: { tsconfigRootDir: cwd() },
}
