#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3';
export const test = () => {
    return runSteps('Test', [['yarn', 'react-scripts test']]);
};
//# sourceMappingURL=test.js.map