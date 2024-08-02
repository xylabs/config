import { Argv } from 'yargs'

import { deploy, deployMajor, deployMinor, deployNext } from '../actions/index.ts'

export const xyDeployCommands = (args: Argv) => {
  return args
    .command(
      'deploy',
      'Deploy - Deploy patch',
      (yargs) => {
        return yargs
      },
      (argv) => {
        if (argv.verbose) console.log('Deploy patch')
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
        if (argv.verbose) console.log('Deploy minor')
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
        if (argv.verbose) console.log('Deploy major')
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
        if (argv.verbose) console.log('Deploy next')
        process.exitCode = deployNext()
      },
    )
}
