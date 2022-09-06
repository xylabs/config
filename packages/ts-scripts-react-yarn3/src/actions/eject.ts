#!/usr/bin/env node
import { runSteps } from '@xylabs/ts-scripts-yarn3'

export const eject = () => {
  return runSteps('Eject', [['yarn', 'react-scripts eject']])
}
