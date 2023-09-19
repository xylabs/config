import xylabsConfig from '@xylabs/eslint-config'
import { ESLint } from 'eslint'
// eslint-disable-next-line import/no-internal-modules
import compact from 'lodash/compact'
import { cwd } from 'process'

import { reactConfig } from './react'

const toArray = <T>(value: T | (T | undefined)[] | undefined): T[] => {
  if (value === undefined) {
    return []
  }
  if (Array.isArray(value)) {
    return compact(value)
  } else {
    return compact([value])
  }
}

const config: ESLint.ConfigData = {
  extends: [...toArray(xylabsConfig.extends), ...toArray(reactConfig.extends)],
  ignorePatterns: ['node_modules', 'build', 'dist', 'docs', 'bin', 'storybook-static', 'package.json'],
  overrides: [...toArray(xylabsConfig.overrides), ...toArray(reactConfig.overrides)],
  parserOptions: { ecmaVersion: 'latest', project: 'tsconfig.json', tsconfigRootDir: cwd() },
  plugins: [...toArray(xylabsConfig.plugins), ...toArray(reactConfig.plugins)],
  rules: {
    ...xylabsConfig.rules,
    ...reactConfig.rules,
  },
  settings: {
    ...xylabsConfig.settings,
    ...reactConfig.settings,
  },
}

/* We use export default to make the type generation correct */

// eslint-disable-next-line import/no-default-export
export default config

/* We use module.exports to make the plugin load work */

module.exports = config
