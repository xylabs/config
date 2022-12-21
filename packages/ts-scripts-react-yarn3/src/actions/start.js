#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3';
export const start = () => {
    return runSteps('Start', [['yarn', 'react-scripts start']]);
};
//# sourceMappingURL=start.js.map