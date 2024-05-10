import unicorn from 'eslint-plugin-unicorn'

export const unicornConfig = [
  {
    plugins: { unicorn },
    rules: {
      'unicorn/catch-error-name': ['off'],
      'unicorn/consistent-function-scoping': ['off'],
      'unicorn/filename-case': ['off'],
      'unicorn/new-for-builtins': ['off'],
      'unicorn/no-array-callback-reference': ['off'],
      'unicorn/no-await-expression-member': ['off'],
      'unicorn/no-nested-ternary': ['off'],
      'unicorn/no-null': ['off'],
      'unicorn/number-literal-case': ['off'],
      'unicorn/prefer-module': ['off'],
      'unicorn/prefer-top-level-await': ['off'],
      'unicorn/prevent-abbreviations': ['off'],
    },
  },
]
