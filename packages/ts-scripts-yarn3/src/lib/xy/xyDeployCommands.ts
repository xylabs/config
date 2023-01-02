import yargs from 'yargs'

import { deploy, deployMajor, deployMinor, deployNext } from '../../actions'

export const xyDeployCommands = (args: yargs.Argv) => {
  return args
    .command(
      'deploy',
      'Deploy - Deploy patch',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy patch')
        process.exitCode = deploy()
      },
    )
    .command(
      'deploy-minor',
      'Deploy - Deploy minor',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy minor')
        process.exitCode = deployMinor()
      },
    )
    .command(
      'deploy-major',
      'Deploy - Deploy major',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy major')
        process.exitCode = deployMajor()
      },
    )
    .command(
      'deploy-next',
      'Deploy - Deploy next',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.info('Deploy next')
        process.exitCode = deployNext()
      },
    )
}
