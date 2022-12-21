#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3';
export const buildci = () => {
    return runSteps('Build', [
        ['yarn', 'react-scripts build'],
        ['yarn', 'lint'],
        ['yarn', 'xy deps'],
        ['ts-node-script', './scripts/sitemap.ts'],
    ]);
};
//# sourceMappingURL=build-ci.js.map