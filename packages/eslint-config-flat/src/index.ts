/* eslint-disable import/no-internal-modules */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ESLint } from 'eslint'

// eslint-disable-next-line import/no-internal-modules
import { importConfig } from './import/index.js'
import { jsonConfig } from './json/index.js'
//import { markdownConfig } from './markdown'
import { prettierConfig } from './prettier/index.js'
import { rulesConfig } from './rules/index.js'
import { typescriptConfig } from './typescript/index.js'
import { unicornConfig } from './unicorn/index.js'
import { workspacesConfig } from './workspaces/index.js'

export const config = [
  ...importConfig,
  ...jsonConfig,
  ...typescriptConfig,
  //workspacesConfig,
  //rulesConfig,
  ...importConfig,
  ...prettierConfig,
  ...unicornConfig,
]
