import chalk from 'chalk'

import { xyBuildCommands } from './xyBuildCommands.ts'
import { xyCommonCommands } from './xyCommonCommands.ts'
import { xyDeployCommands } from './xyDeployCommands.ts'
import { xyInstallCommands } from './xyInstallCommands.ts'
import { xyLintCommands } from './xyLintCommands.ts'
import { xyParseOptions } from './xyParseOptions.ts'

export const xy = async () => {
  const options = xyParseOptions()
  return await xyBuildCommands(xyCommonCommands(xyInstallCommands(xyDeployCommands(xyLintCommands(options)))))
    .demandCommand(1)
    .command('*', '', () => {
      console.error(chalk.yellow(`Command not found [${chalk.magenta(process.argv[2])}]`))
      console.log(chalk.gray("Try 'yarn xy --help' for list of commands"))
    })
    .version()
    .help().argv
}
