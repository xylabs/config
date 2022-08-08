#!/usr/bin/env node

import { runSteps } from './lib'

runSteps('Build CI', [
  ['yarn', 'react-scripts build'],
  ['yarn', 'lint'],
  ['yarn', 'deps'],
  ['yarn', 'sitemap'],
])
