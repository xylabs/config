import jsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'

export const jsonConfig = [
  {
    files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
    plugins: {
      jsonc,
    },
    languageOptions: {
      parser: jsoncParser,
      parserOptions: {
        extraFileExtensions: ['.json'],
      }
    },
    rules: {
      ...jsonc.configs['all'].rules,
      /// jsonc and json5 can have comments
      'jsonc/no-comments': 'off',
      'jsonc/auto': 'off',
      /// Indent with 2 spaces
      'jsonc/indent': ['error', 2, {}],
      /// Support arrays with and without new lines but they can't mix
      'jsonc/array-element-newline': ['error', 'consistent'],
      /// Don't sort keys. We want to keep the order of keys as they are:
      /// especially in arrays.
      'jsonc/sort-keys': 'off',
      /// Not all keys are camelCase
      'jsonc/key-name-casing': 'off',
      /// see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/comma-dangle.html
      'jsonc/comma-dangle': ['error', 'only-multiline'],
    },
  },
  {
    files: ['**/*.json'],
    plugins: {
      jsonc,
    },
    languageOptions: {
      parser: jsonc,
      parserOptions: {
        extraFileExtensions: ['.json'],
      }
    },
    rules: {
      /// Overrides the above configuration object.
      /// No matter how much it would be cool to have comments in json files,
      /// it's not supported by the json spec. We get errors tools like jq and
      /// node.
      'jsonc/no-comments': 'error'
    },
  }
]
