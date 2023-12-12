import { ESLint } from 'eslint'

export const importConfig: ESLint.ConfigData = {
  extends: ['plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
  plugins: ['import', 'simple-import-sort'],
  rules: {
    'import/default': ['off'],
    'import/named': ['off'],
    'import/namespace': ['off'],
    'import/no-absolute-path': ['warn'],
    'import/no-cycle': [
      'off',
      {
        maxDepth: 2,
      },
    ],
    'import/no-default-export': ['warn'],
    'import/no-deprecated': ['warn'],
    'import/no-internal-modules': [
      'warn',
      {
        allow: ['lodash/*'],
      },
    ],
    'import/no-named-as-default': ['warn'],
    'import/no-named-as-default-member': ['off'],
    'import/no-restricted-paths': ['warn'],
    'import/no-self-import': ['warn'],
    'import/no-useless-path-segments': ['warn'],
    'simple-import-sort/exports': ['warn'],
    'simple-import-sort/imports': ['warn'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
}
