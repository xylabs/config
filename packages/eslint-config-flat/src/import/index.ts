import importPlugin from 'eslint-plugin-import'
import { Linter } from 'eslint'

export const importConfig: Linter.FlatConfig = {
  ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**'],
  plugins: { import: importPlugin },
  rules: {
    ...importPlugin.configs.recommended.rules,
    'import/default': ['off'],
    'import/named': ['off'],
    'import/namespace': ['off'],
    'import/no-absolute-path': ['warn'],
    'import/no-cycle': [
      'warn',
      {
        maxDepth: 2,
      },
    ],
    'import/no-default-export': ['warn'],
    'import/no-deprecated': ['warn'],
    'import/no-internal-modules': ['warn'],
    'import/no-named-as-default-member': ['off'],
    'import/no-named-as-default': ['off'],
    'import/no-restricted-paths': ['warn'],
    'import/no-self-import': ['warn'],
    'import/no-useless-path-segments': ['warn'],
  },
}
