module.exports = {
  extends: ['@xylabs', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
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
}
