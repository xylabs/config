module.exports = {
  overrides: [
    {
      extends: 'plugin:eslint-plugin-json-es/recommended',
      files: ['*.json'],
      parser: 'eslint-plugin-json-es',
      rules: {
        'prettier/prettier': ['off'],
      },
    },
  ],
}
