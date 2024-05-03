// eslint.config.js

import {config as xylabsConfig} from "@xylabs/eslint-config-flat";

export default [
    {
        ignores: [".yarn/*", "jest.config.cjs", "**/dist/*", "**/build/*", "**/node_modules/*"],
    },
    ...xylabsConfig,
];