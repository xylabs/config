import { xyBuildCommands } from './xyBuildCommands'
import { xyCommonCommands } from './xyCommonCommands'
import { xyDeployCommands } from './xyDeployCommands'
import { xyInstallCommands } from './xyInstallCommands'
import { xyLintCommands } from './xyLintCommands'
import { xyParseOptions } from './xyParseOptions'

export const xy = () => {
  return xyBuildCommands(xyCommonCommands(xyInstallCommands(xyDeployCommands(xyLintCommands(xyParseOptions())))))
    .demandCommand()
    .help().argv
}
