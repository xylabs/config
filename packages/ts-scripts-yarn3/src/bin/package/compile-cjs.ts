#!/usr/bin/env node

import { getHeapStatistics } from 'v8'
import { packageCompileCjs } from '../../actions'

if (process.argv.find((arg) => arg === '-v')) {
  console.info(`Heap Size: ${getHeapStatistics().total_available_size.toLocaleString()}`)
}

packageCompileCjs()
