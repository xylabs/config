import { Linter } from 'eslint'

//import { jsonConfig } from './json/index.js'
//import { markdownConfig } from './markdown/index.js'
import { prettierConfig } from './prettier/index.js'
import { rulesConfig } from './rules/index.js'
import { typescriptConfig } from './typescript/index.js'
import { unicornConfig } from './unicorn/index.js'
import { workspacesConfig } from './workspaces/index.js'

export const config: Linter.FlatConfig[] = [
  //markdownConfig,
  typescriptConfig,
  //jsonConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  prettierConfig,
]
