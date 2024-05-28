/* eslint-disable @typescript-eslint/no-unused-vars */
import { Linter } from 'eslint'

// eslint-disable-next-line import/no-internal-modules
//import { importConfig } from './import'
//import { jsonConfig } from './json'
//import { markdownConfig } from './markdown'
//import { prettierConfig } from './prettier'
import { rulesConfig } from './rules'
import { typescriptConfig } from './typescript'
import { unicornConfig } from './unicorn'
import { workspacesConfig } from './workspaces'

export const config: Linter.FlatConfig[] = [
  //importConfig,
  typescriptConfig,
  //jsonConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  //...importConfig,
  //...prettierConfig,
]
