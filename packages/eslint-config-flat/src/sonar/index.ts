import type { Linter } from 'eslint'
import sonarjs from 'eslint-plugin-sonarjs'

export const sonarConfig: Linter.Config = {
  plugins: { sonarjs },
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  rules: {
    ...sonarjs.configs.recommended.rules,
    'sonarjs/no-small-switch': ['off'],
    'sonarjs/os-command': ['off'],
    'sonarjs/no-os-command-from-path': ['off'],
    'sonarjs/no-nested-conditional': ['off'],
    'sonarjs/todo-tag': ['warn'],
    'sonarjs/deprecation': ['warn'],
    'sonarjs/cognitive-complexity': ['warn'],
    'sonarjs/no-nested-functions': ['off'],
    'sonarjs/function-return-type': ['off'],
    'sonarjs/pseudo-random': ['warn'],
    'sonarjs/public-static-readonly': ['warn'],
    'sonarjs/post-message': ['warn'],
    'sonarjs/different-types-comparison': ['warn'],
    'sonarjs/no-alphabetical-sort': ['warn'],
    'sonarjs/no-identical-functions': ['warn'],
    'sonarjs/no-empty-test-file': ['warn'],
  },
}
