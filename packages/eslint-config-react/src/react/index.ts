module.exports = {
  overrides: [
    {
      extends: ['@xylabs', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
      files: ['*.tsx'],
      plugins: ['react', 'react-hooks'],
      rules: {
        'import/no-nodejs-modules': ['error'],
        'react-hooks/exhaustive-deps': [
          'warn',
          {
            additionalHooks: '(useAsyncEffect)',
          },
        ],
        'react/prop-types': ['off'],
        'react/react-in-jsx-scope': ['off'],
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
}
