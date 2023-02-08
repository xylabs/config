import { getHeapStatistics } from 'v8'

import { runSteps } from '../../lib'

export const packageCompileEsm = () => {
  const pkg = process.env.INIT_CWD

  if (process.argv.find((arg) => arg === '-v')) {
    console.log(`Heap Size (Total Available): ${getHeapStatistics().total_available_size.toLocaleString()}`)
    console.log(`Heap Size (Limit): ${getHeapStatistics().heap_size_limit.toLocaleString()}`)
    console.log(`Heap Size (Malloced): ${getHeapStatistics().malloced_memory.toLocaleString()}`)
    console.log(`Heap Size (Peek Malloced): ${getHeapStatistics().peak_malloced_memory.toLocaleString()}`)
    console.log(`Heap Size (Used): ${getHeapStatistics().used_heap_size.toLocaleString()}`)
  }

  return runSteps('Package Compile [ESM]', [['tsc', ['--build', `${pkg}/.tsconfig.build.esm.json`]]])
}
