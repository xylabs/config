import xylabsConfig from '@xylabs/eslint-config'
import { ESLint } from 'eslint'
// eslint-disable-next-line import/no-internal-modules
import compact from 'lodash/compact.js'

import { reactConfig } from './react/index.ts'

const toArray = <T>(value: T | (T | undefined)[] | undefined): T[] => {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? compact(value) : compact([value])
}

const config: ESLint.ConfigData = {
  ...xylabsConfig,
  extends: [...toArray(xylabsConfig.extends), ...toArray(reactConfig.extends)],
  ignorePatterns: [...toArray(xylabsConfig.ignorePatterns), 'node_modules', 'build', 'storybook-static'],
  overrides: [...toArray(xylabsConfig.overrides), ...toArray(reactConfig.overrides)],
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
