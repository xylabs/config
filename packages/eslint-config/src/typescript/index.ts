module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      files: ['*.ts*', '*.d.ts*'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        project: '**/tsconfig.json',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'none',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/no-floating-promises': ['warn'],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/semi': ['warn', 'never'],
      },
    },
  ],
}
