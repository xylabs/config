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
    'sonarjs/no-nested-functions': ['off'],
    'sonarjs/function-return-type': ['off'],
    'sonarjs/pseudo-random': ['off'],
    'sonarjs/public-static-readonly': ['warn'],
    'sonarjs/post-message': ['off'],
    'sonarjs/different-types-comparison': ['off'],
    'sonarjs/no-alphabetical-sort': ['warn'],
    'sonarjs/no-identical-functions': ['warn'],
    'sonarjs/no-empty-test-file': ['off'],
    'sonarjs/no-dead-store': ['warn'],
    'sonarjs/no-redundant-jump': ['warn'],
    'sonarjs/void-use': ['off'],

    // handled by eslint
    'sonarjs/cognitive-complexity': ['off'],

    // handled by typescript-eslint
    'sonarjs/no-unused-vars': ['off'],
  },
}
