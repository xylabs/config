import { config as xyConfig } from '@xylabs/eslint-config-flat'
import { Linter } from 'eslint'

import { reactConfig } from './react/index.ts'

export const config: Linter.Config[] = [...xyConfig, reactConfig]

export { reactConfig } from './react/index.ts'
