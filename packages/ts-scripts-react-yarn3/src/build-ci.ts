#!/usr/bin/env node

import { runSteps } from '@xylabs/ts-scripts-yarn3'

runSteps('Build CI', [
  ['yarn', 'react-scripts build'],
  ['yarn', 'lint'],
  ['yarn', 'deps'],
  ['yarn', 'sitemap'],
])
