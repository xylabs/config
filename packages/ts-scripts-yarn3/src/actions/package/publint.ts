import { promises as fs } from 'fs'

export const packagePublint = async () => {
  const pkgDir = process.env.INIT_CWD
  console.log(`packagePublint: ${pkgDir}`)

  const pkg = JSON.parse(await fs.readFile(`${pkgDir}/package.json`, 'utf8'))

  const { publint } = await import('publint')

  const { messages } = await publint({
    level: 'warning',
    pkgDir,
    strict: true,
  })

  // eslint-disable-next-line import/no-internal-modules
  const { formatMessage } = await import('publint/utils')

  messages.forEach((message) => {
    console.log(formatMessage(message, pkg))
  })

  //returning 0 here since we never want publint to be fatal
  return 0
}
