import { ESLint } from 'eslint'
// eslint-disable-next-line import/no-internal-modules
import compact from 'lodash/compact'

import { importConfig } from './import'
//import { jsonConfig } from './json'
//import { markdownConfig } from './markdown'
import { prettierConfig } from './prettier'
import { rulesConfig } from './rules'
import { typescriptConfig } from './typescript'
import { workspacesConfig } from './workspaces'

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
  extends: [
    ...toArray(typescriptConfig.extends),
    ...toArray(workspacesConfig.extends),
    ...toArray(rulesConfig.extends),
    //...toArray(markdownConfig.extends),
    ...toArray(importConfig.extends),
    //...toArray(jsonConfig.extends),
    ...toArray(prettierConfig.extends),
  ],
  ignorePatterns: ['node_modules', 'dist', 'bin', 'storybook-static', '.github', '.vscode', '.yarn', 'package.json'],
  overrides: [
    ...toArray(typescriptConfig.overrides),
    ...toArray(workspacesConfig.overrides),
    ...toArray(rulesConfig.overrides),
    //...toArray(markdownConfig.overrides),
    ...toArray(importConfig.overrides),
    //...toArray(jsonConfig.overrides),
    ...toArray(prettierConfig.overrides),
  ],
  plugins: [
    ...toArray(typescriptConfig.plugins),
    ...toArray(workspacesConfig.plugins),
    ...toArray(rulesConfig.plugins),
    //...toArray(markdownConfig.plugins),
    ...toArray(importConfig.plugins),
    //...toArray(jsonConfig.plugins),
    ...toArray(prettierConfig.plugins),
  ],
  rules: {
    ...typescriptConfig.rules,
    ...workspacesConfig.rules,
    ...rulesConfig.rules,
    //...markdownConfig.rules,
    ...importConfig.rules,
    //...jsonConfig.rules,
    ...prettierConfig.rules,
  },
  settings: {
    ...typescriptConfig.settings,
    ...workspacesConfig.settings,
    ...rulesConfig.settings,
    //...markdownConfig.settings,
    ...importConfig.settings,
    //...jsonConfig.settings,
    ...prettierConfig.settings,
  },
}

/* We use export default to make the type generation correct */

// eslint-disable-next-line import/no-default-export
export default config

/* We use module.exports to make the plugin load work */

module.exports = config
