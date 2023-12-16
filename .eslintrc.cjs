const finalConfig = {
  env: {
    es2024: true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "project": null,
    "tsconfigRootDir": null
  },
  'extends': ['@xylabs/base'],
  "root": true,
  "ignorePatterns": [
    "dist",
    "**/dist",
    "node_modules",
    "docs",
    "coverage",
    "docker",
    "nftData",
    "testData.json",
    "*.stories.*",
    "swagger.json",
    ".yarn",
    ".*"
  ],
  "rules": {
    "no-restricted-imports": [
      "warn",
      {
        "paths": [
          "@xyo-network/bridge",
          "@xyo-network/core",
          "@xyo-network/module",
          "@xyo-network/modules",
          "@xyo-network/node",
          "@xyo-network/sdk",
          "@xyo-network/plugins",
          "@xyo-network/protocol",
          "@xyo-network/witness",
          "react-player",
          "filepond",
          "aos",
          "react-icons",
          ".",
          "..",
          "../..",
          "../../..",
          "../../../..",
          "../../../../..",
          "../../../../../..",
          "../../../../../../.."
        ]
      }
    ],
    "import/no-internal-modules": [
      "warn", {
        "allow": [
          "source-map-support/*",
          "lodash/*",
          "aws-sdk/**/*",
          "types/*"
        ]
      }
    ]
  }
}

module.exports = finalConfig
