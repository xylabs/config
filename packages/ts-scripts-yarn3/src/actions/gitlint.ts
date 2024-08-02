import chalk from 'chalk'
import ParseGitConfig from 'parse-git-config'

export const gitlint = () => {
  console.log(`\nGitlint Start [${process.cwd()}]\n`)
  let valid = 0
  let warnings = 0
  const errors = 0
  const gitConfig = ParseGitConfig.sync()

  const warn = (message: string) => {
    console.warn(chalk.yellow(`Warning: ${message}`))
    warnings++
  }

  if (gitConfig.core.ignorecase) {
    warn('Please set core.ignorecase to FALSE in .git/config file [run yarn gitlint-fix]')
  } else {
    valid++
  }

  if (gitConfig.core.autocrlf === false) {
    valid++
  } else {
    warn('Please set core.autocrlf to FALSE in .git/config file [run yarn gitlint-fix]')
  }

  if (gitConfig.core.eol === 'lf') {
    valid++
  } else {
    warn('Please set core.eol to "lf" in .git/config file [run yarn gitlint-fix]')
  }

  const resultMessages: string[] = []
  if (valid > 0) {
    resultMessages.push(chalk.green(`Passed: ${valid}`))
  }
  if (warnings > 0) {
    resultMessages.push(chalk.yellow(`Warnings: ${warnings}`))
  }
  if (errors > 0) {
    resultMessages.push(chalk.red(` Errors: ${errors}`))
  }
  console.warn(`Gitlint Finish [ ${resultMessages.join(' | ')} ]\n`)
  return warnings + errors === 0 ? 1 : 0
}
