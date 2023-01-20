import { version } from 'os'
import { getHeapStatistics } from 'v8'
import yargs from 'yargs'

import { build, compile, copyAssets, rebuild } from '../../actions'

export const xyBuildCommands = (args: yargs.Argv) => {
  return args
    .command(
      'build [package]',
      'Build - Compile & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to build',
        })
      },
      (argv) => {
        if (argv.verbose) {
          console.log(`Building: ${argv.package ?? 'all'}`)
          console.log(`OS: ${version}`)
          console.log(`Node: ${process.version}`)
          console.log(`Heap Size (Total Available): ${getHeapStatistics().total_available_size.toLocaleString()}`)
          console.log(`Heap Size (Limit): ${getHeapStatistics().heap_size_limit.toLocaleString()}`)
          console.log(`Heap Size (Malloced): ${getHeapStatistics().malloced_memory.toLocaleString()}`)
          console.log(`Heap Size (Peek Malloced): ${getHeapStatistics().peak_malloced_memory.toLocaleString()}`)
          console.log(`Heap Size (Used): ${getHeapStatistics().used_heap_size.toLocaleString()}`)
        }

        process.exitCode = build({ pkg: argv.package as string, target: argv.target as 'esm' | 'cjs', verbose: !!argv.verbose })
      },
    )
    .command(
      'compile [package]',
      'Compile with Typescript & Copy Images',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to compile',
        })
      },
      (argv) => {
        if (argv.verbose) {
          console.log(`Compiling: ${argv.package ?? 'all'}`)
          console.log(`OS: ${version}`)
          console.log(`Node: ${process.version}`)
          console.log(`Heap Size (Total Available): ${getHeapStatistics().total_available_size.toLocaleString()}`)
          console.log(`Heap Size (Limit): ${getHeapStatistics().heap_size_limit.toLocaleString()}`)
          console.log(`Heap Size (Malloced): ${getHeapStatistics().malloced_memory.toLocaleString()}`)
          console.log(`Heap Size (Peek Malloced): ${getHeapStatistics().peak_malloced_memory.toLocaleString()}`)
          console.log(`Heap Size (Used): ${getHeapStatistics().used_heap_size.toLocaleString()}`)
        }
        process.exitCode = compile({
          incremental: !!argv.incremental,
          pkg: argv.package as string,
          target: argv.target as 'esm' | 'cjs',
          verbose: !!argv.verbose,
        })
      },
    )
    .command(
      'rebuild [package]',
      'Rebuild - Clean, Compile & Lint',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to rebuild',
        })
      },
      (argv) => {
        if (argv.verbose) console.log(`Rebuilding: ${argv.package ?? 'all'}`)
        process.exitCode = rebuild({ target: argv.target as 'esm' | 'cjs' })
      },
    )
    .command(
      'copy-assets [package]',
      'Copy Assets - Copy the assets from src to dist',
      (yargs) => {
        return yargs.positional('package', {
          describe: 'Specific package to copy assets',
        })
      },
      async (argv) => {
        if (argv.verbose) console.log(`Copying Assets: ${argv.package ?? 'all'}`)
        process.exitCode = await copyAssets({ target: argv.target as 'esm' | 'cjs' })
      },
    )
}
