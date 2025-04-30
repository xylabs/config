import type { Argv } from 'yargs'
import yargs from 'yargs'
// eslint-disable-next-line import-x/no-internal-modules
import { hideBin } from 'yargs/helpers'

export const xyParseOptions = (): Argv => {
  return yargs(hideBin(process.argv))
    .scriptName('yarn xy')
    .option('jobs', {
      alias: 'j',
      default: undefined,
      description: 'Max parallel jobs',
      type: 'number',
    })
    .option('verbose', {
      alias: 'v',
      default: false,
      description: 'Run with verbose logging',
      type: 'boolean',
    })
    .option('incremental', {
      alias: 'i',
      default: false,
      description: 'Attempt to perform the action only on changed packages',
      type: 'boolean',
    })
    .option('profile', {
      alias: 'p',
      default: false,
      description: 'Profile action',
      type: 'boolean',
    })
}
