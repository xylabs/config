import chalk from 'chalk'

import { xyBuildCommands } from './xyBuildCommands'
import { xyCommonCommands } from './xyCommonCommands'
import { xyDeployCommands } from './xyDeployCommands'
import { xyInstallCommands } from './xyInstallCommands'
import { xyLintCommands } from './xyLintCommands'
import { xyParseOptions } from './xyParseOptions'

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
