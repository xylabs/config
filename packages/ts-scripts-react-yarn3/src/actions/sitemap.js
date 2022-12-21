#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3';
export const sitemap = () => {
    return runSteps('Sitemap', [['ts-node-script', './scripts/sitemap.ts']]);
};
//# sourceMappingURL=sitemap.js.map