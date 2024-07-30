import { config as xyConfig } from '@xylabs/eslint-config-flat'
import { Linter } from 'eslint'

import { reactConfig } from './react/index.js'

export const config: Linter.FlatConfig[] = [...xyConfig, reactConfig]

export { reactConfig } from './react/index.js'
