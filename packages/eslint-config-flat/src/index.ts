import { Linter } from 'eslint'

//import { jsonConfig } from './json/index.js'
//import { markdownConfig } from './markdown/index.js'
import { prettierConfig } from './prettier/index.js'
import { rulesConfig } from './rules/index.js'
import { typescriptConfig } from './typescript/index.js'
import { unicornConfig } from './unicorn/index.js'
import { workspacesConfig } from './workspaces/index.js'
import { importConfig } from './import/index.js'

export const config: Linter.FlatConfig[] = [
  //markdownConfig,
  typescriptConfig,
  //jsonConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  prettierConfig,
  importConfig,
]

export { importConfig } from './import/index.js'
export { prettierConfig } from './prettier/index.js'
export { rulesConfig } from './rules/index.js'
export { typescriptConfig } from './typescript/index.js'
export { unicornConfig } from './unicorn/index.js'
export { workspacesConfig } from './workspaces/index.js'
