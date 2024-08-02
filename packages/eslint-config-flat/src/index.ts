import { Linter } from 'eslint'

import { importConfig } from './import/index.ts'
//import { jsonConfig } from './json/index.ts'
//import { markdownConfig } from './markdown/index.ts'
import { prettierConfig } from './prettier/index.ts'
import { rulesConfig } from './rules/index.ts'
import { sonarConfig } from './sonar/index.ts'
import { typescriptConfig } from './typescript/index.ts'
import { unicornConfig } from './unicorn/index.ts'
import { workspacesConfig } from './workspaces/index.ts'

export const config: Linter.FlatConfig[] = [
  //markdownConfig,
  typescriptConfig,
  //jsonConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  prettierConfig,
  importConfig,
  sonarConfig,
]

export { importConfig } from './import/index.ts'
export { prettierConfig } from './prettier/index.ts'
export { rulesConfig } from './rules/index.ts'
export { sonarConfig } from './sonar/index.ts'
export { typescriptConfig } from './typescript/index.ts'
export { unicornConfig } from './unicorn/index.ts'
export { workspacesConfig } from './workspaces/index.ts'
