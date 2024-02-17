import chalk from 'chalk'
import { init } from 'license-checker'

import { yarnWorkspaces } from '../lib'

export const license = async (pkg?: string) => {
  const workspaces = yarnWorkspaces()
  const workspaceList = workspaces.filter(({ name }) => {
    return pkg === undefined || name === pkg
  })

  const exclude = new Set([
    'MIT',
    'MIT*',
    'ISC',
    'Apache-2.0',
    'BSD',
    'BSD*',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'CC-BY-4.0',
    'Unlicense',
    'CC-BY-3.0',
    'CC0-1.0',
    'LGPL-3.0-only',
    'LGPL-3.0',
    'LGPL-3.0-or-later',
    'Python-2.0',
  ])

  console.log(chalk.green('License Checker'))

  return (
    (
      await Promise.all(
        workspaceList.map(({ location, name }) => {
          return new Promise<number>((resolve) => {
            init({ production: true, start: location }, (error, packages) => {
              if (error) {
                console.error(chalk.red(`License Checker [${name}] Error`))
                console.error(chalk.gray(error))
                console.log('\n')
                resolve(1)
              } else {
                console.log(chalk.green(`License Checker [${name}]`))
                let count = 0
                for (const [name, info] of Object.entries(packages)) {
                  const licenses = Array.isArray(info.licenses) ? info.licenses : [info.licenses]
                  for (let license of licenses) {
                    if (license) {
                      //remove surrounding parens on some string
                      if (license[0] === '(' && license.at(-1) === ')') {
                        license = license.slice(1, -2)
                      }
                      //get list of OR licenses from string
                      const orLicenses = license.split(' OR ')
                      let orLicenseFound = false
                      for (const orLicense of orLicenses) {
                        if (exclude.has(orLicense)) {
                          orLicenseFound = true
                        }
                      }
                      if (!orLicenseFound) {
                        count++
                        console.warn(chalk.yellow(`${name}: Package License not allowed [${license}]`))
                      }
                    }
                  }
                }
                console.log('\n')
                resolve(count)
              }
            })
          })
        }),
      )
    )
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((prev, value) => prev || value, 0)
  )
}
