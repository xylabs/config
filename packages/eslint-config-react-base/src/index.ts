import { cwd } from 'node:process'

import xylabsConfig from '@xylabs/eslint-config-base'
import { ESLint } from 'eslint'

import compact from 'lodash/compact'

import { reactConfig } from './react'

const toArray = <T>(value: T | (T | undefined)[] | undefined): T[] => {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? compact(value) : compact([value])
}

const config: ESLint.ConfigData = {
  extends: [...toArray(xylabsConfig.extends), ...toArray(reactConfig.extends)],
  ignorePatterns: [...toArray(xylabsConfig.ignorePatterns), 'node_modules', 'build', 'storybook-static'],
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

export default config

/* We use module.exports to make the plugin load work */

module.exports = config
