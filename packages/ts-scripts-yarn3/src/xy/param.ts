import type { Argv } from 'yargs'

export const packagePositionalParam = (yargs: Argv<unknown>) => {
  return yargs.positional('package', { describe: 'Specific package to target', type: 'string' })
}
