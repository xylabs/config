// eslint-disable-next-line import/no-nodejs-modules
import { cwd } from 'process'

module.exports = {
  extends: ['@xylabs', './react'],
  parserOptions: { tsconfigRootDir: cwd() },
}
